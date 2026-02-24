import { Router } from 'express';
import { HealthController } from '@src/features/health/presentation/controllers/health-controller';

interface HealthRouteDependencies {
  healthController: HealthController;
}

export const createHealthRoutes = ({ healthController }: HealthRouteDependencies): Router => {
  const router = Router();
  router.get('/health', healthController.checkHealth);
  return router;
};
