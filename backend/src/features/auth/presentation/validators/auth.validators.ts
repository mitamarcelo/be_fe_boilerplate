import { z } from 'zod';
import { ValidationError } from '@src/shared/domain/errors/app-error';
import { LoginRequestDto, RegisterUserRequestDto } from '@src/features/auth/application/dto/auth.dto';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const parseRegisterBody = (body: unknown): RegisterUserRequestDto => {
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError('Invalid register payload', parsed.error.flatten());
  }

  return parsed.data;
};

export const parseLoginBody = (body: unknown): LoginRequestDto => {
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError('Invalid login payload', parsed.error.flatten());
  }

  return parsed.data;
};
