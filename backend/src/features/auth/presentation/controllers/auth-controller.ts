import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '@src/shared/domain/errors/app-error';
import { LoginUserUseCase } from '@src/features/auth/application/use-cases/login-user.use-case';
import { LogoutUserUseCase } from '@src/features/auth/application/use-cases/logout-user.use-case';
import { RegisterUserUseCase } from '@src/features/auth/application/use-cases/register-user.use-case';
import { parseLoginBody, parseRegisterBody } from '@src/features/auth/presentation/validators/auth.validators';

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase
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

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth?.token || typeof req.auth.exp !== 'number') {
        throw new UnauthorizedError('Unauthorized');
      }

      await this.logoutUserUseCase.execute({
        token: req.auth.token,
        exp: req.auth.exp
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
