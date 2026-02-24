import { UnauthorizedError } from '@src/shared/domain/errors/app-error';
import { HashService } from '@src/features/auth/application/ports/hash-service';
import { TokenService } from '@src/features/auth/application/ports/token-service';
import { UserRepository } from '@src/features/auth/application/ports/user-repository';
import { LoginUserUseCase } from '@src/features/auth/application/use-cases/login-user.use-case';

describe('LoginUserUseCase', () => {
  const buildSut = () => {
    const userRepository: jest.Mocked<UserRepository> = {
      findByEmail: jest.fn(),
      create: jest.fn()
    };

    const hashService: jest.Mocked<HashService> = {
      hash: jest.fn(),
      compare: jest.fn()
    };

    const tokenService: jest.Mocked<TokenService> = {
      signAccessToken: jest.fn(),
      verifyAccessToken: jest.fn()
    };

    const useCase = new LoginUserUseCase(userRepository, hashService, tokenService);

    return { useCase, userRepository, hashService, tokenService };
  };

  it('returns access token for valid credentials', async () => {
    const { useCase, userRepository, hashService, tokenService } = buildSut();

    userRepository.findByEmail.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      createdAt: new Date()
    });
    hashService.compare.mockResolvedValue(true);
    tokenService.signAccessToken.mockResolvedValue('token-value');

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(result).toEqual({ accessToken: 'token-value' });
  });

  it('throws unauthorized error when user does not exist', async () => {
    const { useCase, userRepository } = buildSut();

    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: 'missing@example.com',
        password: 'password123'
      })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('throws unauthorized error when password does not match', async () => {
    const { useCase, userRepository, hashService } = buildSut();

    userRepository.findByEmail.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      createdAt: new Date()
    });
    hashService.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({
        email: 'test@example.com',
        password: 'wrong-password'
      })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
