import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '@src/shared/domain/errors/app-error';
import { LoginUserUseCase } from '@src/features/auth/application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '@src/features/auth/application/use-cases/register-user.use-case';
import { parseLoginBody, parseRegisterBody } from '@src/features/auth/presentation/validators/auth.validators';

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = parseRegisterBody(req.body);
      const result = await this.registerUserUseCase.execute(dto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = parseLoginBody(req.body);
      const result = await this.loginUserUseCase.execute(dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  me = (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.auth) {
        throw new UnauthorizedError('Unauthorized');
      }

      res.status(200).json({
        id: req.auth.sub,
        email: req.auth.email
      });
    } catch (error) {
      next(error);
    }
  };
}
