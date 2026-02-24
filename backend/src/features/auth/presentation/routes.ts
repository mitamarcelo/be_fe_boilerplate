import { Router } from 'express';
import { TokenService } from '@src/features/auth/application/ports/token-service';
import { AuthController } from '@src/features/auth/presentation/controllers/auth-controller';
import { createAuthMiddleware } from '@src/shared/presentation/middleware/auth-middleware';

interface AuthRouteDependencies {
  authController: AuthController;
  tokenService: TokenService;
}

export const createAuthRoutes = ({ authController, tokenService }: AuthRouteDependencies): Router => {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  router.post('/register', authController.register);
  router.post('/login', authController.login);
  router.get('/me', authMiddleware, authController.me);

  return router;
};
