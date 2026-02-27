declare global {
  namespace Express {
    interface Request {
      auth?: {
        sub: string;
        email: string;
        exp?: number;
        token?: string;
      };
    }
  }
}

export {};
