-- =====================================================================
-- FIX: Auto-assign admin role + Secure RLS for invitation_links
-- =====================================================================

-- 1. Funciones de soporte (idempotentes)
create or replace function public.get_user_empresa_id(_user_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select empresa_id
  from public.user_roles
  where user_id = _user_id
  limit 1
$$;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- 2. Endurecer RLS en invitation_links (evitar recursion y asegurar created_by)
drop policy if exists "Admins can create invitation links for their company" on public.invitation_links;
drop policy if exists "Admins can update invitation links for their company" on public.invitation_links;
drop policy if exists "Admins can delete invitation links for their company" on public.invitation_links;
drop policy if exists "Admins can view invitation links for their company" on public.invitation_links;

create policy "Admins can create invitation links for their company"
on public.invitation_links
for insert
to authenticated
with check (
  public.has_role(auth.uid(), 'admin')
  and empresa_id = public.get_user_empresa_id(auth.uid())
  and created_by = auth.uid()
);

create policy "Admins can update invitation links for their company"
on public.invitation_links
for update
to authenticated
using (
  public.has_role(auth.uid(), 'admin')
  and empresa_id = public.get_user_empresa_id(auth.uid())
)
with check (
  public.has_role(auth.uid(), 'admin')
  and empresa_id = public.get_user_empresa_id(auth.uid())
);

create policy "Admins can delete invitation links for their company"
on public.invitation_links
for delete
to authenticated
using (
  public.has_role(auth.uid(), 'admin')
  and empresa_id = public.get_user_empresa_id(auth.uid())
);

create policy "Admins can view invitation links for their company"
on public.invitation_links
for select
to authenticated
using (
  public.has_role(auth.uid(), 'admin')
  and empresa_id = public.get_user_empresa_id(auth.uid())
);

-- 3. Arreglar RLS recursiva de user_roles
drop policy if exists "Admins can manage all roles in their company" on public.user_roles;
create policy "Admins can manage all roles in their company"
on public.user_roles
for all
to authenticated
using (
  public.has_role(auth.uid(), 'admin')
  and empresa_id = public.get_user_empresa_id(auth.uid())
)
with check (
  public.has_role(auth.uid(), 'admin')
  and empresa_id = public.get_user_empresa_id(auth.uid())
);

drop policy if exists "Users can view their own roles" on public.user_roles;
create policy "Users can view their own roles"
on public.user_roles
for select
to authenticated
using (user_id = auth.uid());

-- 4. Trigger para auto-asignar admin al primer usuario de cada empresa
create or replace function public.ensure_company_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if NEW.empresa_id is null then
    return NEW;
  end if;

  -- Si la empresa aún no tiene admin, asignar admin al usuario recién creado
  if not exists (
    select 1 from public.user_roles
    where empresa_id = NEW.empresa_id and role = 'admin'
  ) then
    insert into public.user_roles (user_id, empresa_id, role)
    values (NEW.user_id, NEW.empresa_id, 'admin');
  end if;

  return NEW;
end;
$$;

drop trigger if exists trg_profiles_ensure_admin on public.profiles;
create trigger trg_profiles_ensure_admin
after insert on public.profiles
for each row
execute function public.ensure_company_admin();

-- 5. Backfill: empresas sin admin actual
insert into public.user_roles (user_id, empresa_id, role)
select p.user_id, p.empresa_id, 'admin'::app_role
from public.profiles p
join (
  select empresa_id, min(created_at) as first_created
  from public.profiles
  where empresa_id is not null
  group by empresa_id
) f on f.empresa_id = p.empresa_id and f.first_created = p.created_at
where p.empresa_id is not null
  and not exists (
    select 1 from public.user_roles ur
    where ur.empresa_id = p.empresa_id and ur.role = 'admin'
  );

-- 6. Índices para rendimiento
create index if not exists idx_user_roles_user_id on public.user_roles(user_id);
create index if not exists idx_user_roles_empresa_role on public.user_roles(empresa_id, role);