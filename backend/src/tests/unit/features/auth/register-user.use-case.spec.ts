import { ConflictError } from '@src/shared/domain/errors/app-error';
import { HashService } from '@src/features/auth/application/ports/hash-service';
import { UserRepository } from '@src/features/auth/application/ports/user-repository';
import { RegisterUserUseCase } from '@src/features/auth/application/use-cases/register-user.use-case';

describe('RegisterUserUseCase', () => {
  const buildSut = () => {
    const userRepository: jest.Mocked<UserRepository> = {
      findByEmail: jest.fn(),
      create: jest.fn()
    };

    const hashService: jest.Mocked<HashService> = {
      hash: jest.fn(),
      compare: jest.fn()
    };

    const useCase = new RegisterUserUseCase(userRepository, hashService);

    return { useCase, userRepository, hashService };
  };

  it('registers a user with normalized email', async () => {
    const { useCase, userRepository, hashService } = buildSut();

    userRepository.findByEmail.mockResolvedValue(null);
    hashService.hash.mockResolvedValue('hashed-password');
    userRepository.create.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      createdAt: new Date('2026-01-01T00:00:00.000Z')
    });

    const result = await useCase.execute({
      email: 'Test@Example.com',
      password: 'password123'
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(result).toEqual({
      id: 'user-1',
      email: 'test@example.com',
      createdAt: '2026-01-01T00:00:00.000Z'
    });
  });

  it('throws conflict error when email already exists', async () => {
    const { useCase, userRepository } = buildSut();

    userRepository.findByEmail.mockResolvedValue({
      id: 'existing',
      email: 'test@example.com',
      passwordHash: 'hashed',
      createdAt: new Date()
    });

    await expect(
      useCase.execute({
        email: 'test@example.com',
        password: 'password123'
      })
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
