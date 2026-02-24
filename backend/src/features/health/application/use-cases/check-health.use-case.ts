export interface HealthResponse {
  status: 'ok';
  uptime: number;
  timestamp: string;
}

export class CheckHealthUseCase {
  execute(): HealthResponse {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }
}
