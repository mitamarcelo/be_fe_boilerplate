import { Router } from 'express';
import { TokenService } from '@src/features/auth/application/ports/token-service';
import { RevokedTokenRepository } from '@src/features/auth/application/ports/revoked-token-repository';
import { AuthController } from '@src/features/auth/presentation/controllers/auth-controller';
import { createAuthRoutes } from '@src/features/auth/presentation/routes';
import { HealthController } from '@src/features/health/presentation/controllers/health-controller';
import { createHealthRoutes } from '@src/features/health/presentation/routes';

interface ApiRoutesDependencies {
  authController: AuthController;
  healthController: HealthController;
  tokenService: TokenService;
  revokedTokenRepository: RevokedTokenRepository;
}

export const createApiRoutes = ({
  authController,
  healthController,
  tokenService,
  revokedTokenRepository
}: ApiRoutesDependencies): Router => {
  const router = Router();

  router.use('/auth', createAuthRoutes({ authController, tokenService, revokedTokenRepository }));
  router.use(createHealthRoutes({ healthController }));

  return router;
};
