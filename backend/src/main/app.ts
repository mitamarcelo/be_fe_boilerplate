import cors from 'cors';
import express, { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import { LoginUserUseCase } from '@src/features/auth/application/use-cases/login-user.use-case';
import { LogoutUserUseCase } from '@src/features/auth/application/use-cases/logout-user.use-case';
import { RegisterUserUseCase } from '@src/features/auth/application/use-cases/register-user.use-case';
import { PrismaRevokedTokenRepository } from '@src/features/auth/infrastructure/repositories/prisma-revoked-token-repository';
import { PrismaUserRepository } from '@src/features/auth/infrastructure/repositories/prisma-user-repository';
import { BcryptHashService } from '@src/features/auth/infrastructure/services/bcrypt-hash-service';
import { JwtTokenService } from '@src/features/auth/infrastructure/services/jwt-token-service';
import { AuthController } from '@src/features/auth/presentation/controllers/auth-controller';
import { CheckHealthUseCase } from '@src/features/health/application/use-cases/check-health.use-case';
import { HealthController } from '@src/features/health/presentation/controllers/health-controller';
import { errorHandler } from '@src/shared/presentation/middleware/error-handler';
import { env } from '@src/main/config/env';
import { createApiRoutes } from '@src/main/routes';

export const createApp = (): Express => {
  const app = express();
  const prismaClient = new PrismaClient();

  const userRepository = new PrismaUserRepository(prismaClient);
  const revokedTokenRepository = new PrismaRevokedTokenRepository(prismaClient);
  const hashService = new BcryptHashService();
  const tokenService = new JwtTokenService(env.JWT_SECRET, env.JWT_EXPIRES_IN);

  const registerUserUseCase = new RegisterUserUseCase(userRepository, hashService);
  const loginUserUseCase = new LoginUserUseCase(userRepository, hashService, tokenService);
  const logoutUserUseCase = new LogoutUserUseCase(revokedTokenRepository);
  const authController = new AuthController(registerUserUseCase, loginUserUseCase, logoutUserUseCase);

  const checkHealthUseCase = new CheckHealthUseCase();
  const healthController = new HealthController(checkHealthUseCase);

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/v1',
    createApiRoutes({
      authController,
      healthController,
      tokenService,
      revokedTokenRepository
    })
  );

  app.use(errorHandler);

  return app;
};
