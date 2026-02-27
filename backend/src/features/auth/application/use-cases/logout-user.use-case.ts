import { UnauthorizedError } from '@src/shared/domain/errors/app-error';
import { RevokedTokenRepository } from '@src/features/auth/application/ports/revoked-token-repository';

export interface LogoutRequest {
  token: string;
  exp: number;
}

export class LogoutUserUseCase {
  constructor(private readonly revokedTokenRepository: RevokedTokenRepository) {}

  async execute(request: LogoutRequest): Promise<void> {
    if (!request.token) {
      throw new UnauthorizedError('Missing bearer token');
    }

    if (typeof request.exp !== 'number') {
      throw new UnauthorizedError('Invalid token payload');
    }

    await this.revokedTokenRepository.create({
      token: request.token,
      revokedAt: new Date(),
      expiresAt: new Date(request.exp * 1000)
    });
  }
}
