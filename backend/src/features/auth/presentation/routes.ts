import { Router } from 'express';
import { TokenService } from '@src/features/auth/application/ports/token-service';
import { AuthController } from '@src/features/auth/presentation/controllers/auth-controller';
import { RevokedTokenRepository } from '@src/features/auth/application/ports/revoked-token-repository';
import { createAuthMiddleware } from '@src/shared/presentation/middleware/auth-middleware';

interface AuthRouteDependencies {
  authController: AuthController;
  tokenService: TokenService;
  revokedTokenRepository: RevokedTokenRepository;
}

export const createAuthRoutes = ({
  authController,
  tokenService,
  revokedTokenRepository
}: AuthRouteDependencies): Router => {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService, revokedTokenRepository);

  router.post('/register', authController.register);
  router.post('/login', authController.login);
  router.get('/me', authMiddleware, authController.me);
  router.post('/logout', authMiddleware, authController.logout);

  return router;
};
