import { NextFunction, Request, Response } from 'express';
import { TokenService } from '@src/features/auth/application/ports/token-service';
import { UnauthorizedError } from '@src/shared/domain/errors/app-error';

export const createAuthMiddleware = (tokenService: TokenService) => {
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

      req.auth = await tokenService.verifyAccessToken(token);
      next();
    } catch (error) {
      next(error);
    }
  };
};
