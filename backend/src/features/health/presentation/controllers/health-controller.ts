import { Request, Response } from 'express';
import { CheckHealthUseCase } from '@src/features/health/application/use-cases/check-health.use-case';

export class HealthController {
  constructor(private readonly checkHealthUseCase: CheckHealthUseCase) {}

  checkHealth = (_req: Request, res: Response): void => {
    const health = this.checkHealthUseCase.execute();
    res.status(200).json(health);
  };
}
