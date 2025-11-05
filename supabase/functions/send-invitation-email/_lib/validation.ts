import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const invitationSchema = z.object({
  email: z.string().email('Email inválido'),
  rol: z.enum(['admin', 'agent', 'supervisor', 'assistant'], {
    errorMap: () => ({ message: 'Rol inválido' }),
  }),
  empresaId: z.string().uuid('ID de empresa inválido'),
});

export type InvitationRequest = z.infer<typeof invitationSchema>;

export function validateInvitationRequest(data: unknown) {
  return invitationSchema.safeParse(data);
}
