-- ========================================
-- PHASE 1: Database Schema for User Invitations
-- ========================================

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'agent', 'supervisor', 'assistant');

-- ========================================
-- Table: user_roles
-- ========================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  empresa_id UUID REFERENCES public.empresa(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id, empresa_id)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles in their company"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') 
  AND empresa_id IN (
    SELECT empresa_id FROM public.user_roles WHERE user_id = auth.uid()
  )
);

-- ========================================
-- Table: user_invitations
-- ========================================
CREATE TABLE public.user_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  role public.app_role NOT NULL,
  token TEXT UNIQUE NOT NULL,
  empresa_id UUID REFERENCES public.empresa(id) ON DELETE CASCADE NOT NULL,
  invited_by UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  sent_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '7 days') NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on user_invitations
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_invitations
CREATE POLICY "Admins can view invitations for their company"
ON public.user_invitations
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  AND empresa_id IN (
    SELECT empresa_id FROM public.user_roles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can insert invitations for their company"
ON public.user_invitations
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
  AND empresa_id IN (
    SELECT empresa_id FROM public.user_roles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can update invitations for their company"
ON public.user_invitations
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  AND empresa_id IN (
    SELECT empresa_id FROM public.user_roles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can view invitation by token"
ON public.user_invitations
FOR SELECT
TO anon, authenticated
USING (status = 'pending' AND expires_at > now());

-- ========================================
-- Table: email_rate_limits
-- ========================================
CREATE TABLE public.email_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  empresa_id UUID REFERENCES public.empresa(id) ON DELETE CASCADE NOT NULL,
  email_count INTEGER DEFAULT 0,
  window_start TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id, empresa_id)
);

-- Enable RLS on email_rate_limits
ALTER TABLE public.email_rate_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_rate_limits
CREATE POLICY "Users can view their own rate limits"
ON public.email_rate_limits
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "System can manage rate limits"
ON public.email_rate_limits
FOR ALL
TO authenticated
USING (true);

-- ========================================
-- Utility Functions
-- ========================================

-- Function to expire old invitations
CREATE OR REPLACE FUNCTION public.expire_old_invitations()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  UPDATE public.user_invitations
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at < now();
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  RETURN expired_count;
END;
$$;

-- Function to check and increment rate limit
CREATE OR REPLACE FUNCTION public.check_and_increment_rate_limit(
  _user_id UUID,
  _empresa_id UUID,
  _max_emails INTEGER DEFAULT 50,
  _window_hours INTEGER DEFAULT 24
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count INTEGER;
  current_window TIMESTAMPTZ;
BEGIN
  -- Get or create rate limit record
  SELECT email_count, window_start
  INTO current_count, current_window
  FROM public.email_rate_limits
  WHERE user_id = _user_id AND empresa_id = _empresa_id;
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.email_rate_limits (user_id, empresa_id, email_count, window_start)
    VALUES (_user_id, _empresa_id, 1, now());
    RETURN true;
  END IF;
  
  -- Check if window has expired
  IF current_window + (_window_hours || ' hours')::INTERVAL < now() THEN
    -- Reset the window
    UPDATE public.email_rate_limits
    SET email_count = 1, window_start = now()
    WHERE user_id = _user_id AND empresa_id = _empresa_id;
    RETURN true;
  END IF;
  
  -- Check if limit exceeded
  IF current_count >= _max_emails THEN
    RETURN false;
  END IF;
  
  -- Increment count
  UPDATE public.email_rate_limits
  SET email_count = email_count + 1
  WHERE user_id = _user_id AND empresa_id = _empresa_id;
  
  RETURN true;
END;
$$;

-- Create indexes for performance
CREATE INDEX idx_user_invitations_token ON public.user_invitations(token);
CREATE INDEX idx_user_invitations_email ON public.user_invitations(email);
CREATE INDEX idx_user_invitations_status ON public.user_invitations(status);
CREATE INDEX idx_user_invitations_empresa ON public.user_invitations(empresa_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_empresa_id ON public.user_roles(empresa_id);

-- Trigger to update updated_at
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();