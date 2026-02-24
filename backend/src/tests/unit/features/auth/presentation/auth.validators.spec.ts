import { ValidationError } from '@src/shared/domain/errors/app-error';
import {
  parseLoginBody,
  parseRegisterBody
} from '@src/features/auth/presentation/validators/auth.validators';

describe('auth validators', () => {
  it('parses valid register payload', () => {
    const result = parseRegisterBody({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(result).toEqual({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  it('throws for malformed register payload', () => {
    expect(() =>
      parseRegisterBody({
        email: 'invalid-email',
        password: 'short'
      })
    ).toThrow(ValidationError);
  });

  it('throws for malformed login payload', () => {
    expect(() =>
      parseLoginBody({
        email: 'test@example.com'
      })
    ).toThrow(ValidationError);
  });
});
