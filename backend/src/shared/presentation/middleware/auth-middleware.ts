import { NextFunction, Request, Response } from 'express';
import { TokenService } from '@src/features/auth/application/ports/token-service';
import { RevokedTokenRepository } from '@src/features/auth/application/ports/revoked-token-repository';
import { UnauthorizedError } from '@src/shared/domain/errors/app-error';

export const createAuthMiddleware = (
  tokenService: TokenService,
  revokedTokenRepository: RevokedTokenRepository
) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Missing bearer token');
      }

      const token = authHeader.replace('Bearer ', '').trim();
      if (!token) {
        throw new UnauthorizedError('Missing bearer token');
      }

      await revokedTokenRepository.removeExpired(new Date());

      const payload = await tokenService.verifyAccessToken(token);
      const isRevoked = await revokedTokenRepository.isRevoked(token);
      if (isRevoked) {
        throw new UnauthorizedError('Invalid token');
      }

      req.auth = {
        ...payload,
        token
      };
      next();
    } catch (error) {
      next(error);
    }
  };
};
