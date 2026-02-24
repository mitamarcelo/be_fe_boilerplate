import { ConflictError } from '@src/shared/domain/errors/app-error';
import { RegisterUserRequestDto, RegisterUserResponseDto } from '@src/features/auth/application/dto/auth.dto';
import { HashService } from '@src/features/auth/application/ports/hash-service';
import { UserRepository } from '@src/features/auth/application/ports/user-repository';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService
  ) {}

  async execute(dto: RegisterUserRequestDto): Promise<RegisterUserResponseDto> {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const existingUser = await this.userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new ConflictError('Email is already registered');
    }

    const passwordHash = await this.hashService.hash(dto.password);
    const user = await this.userRepository.create({
      email: normalizedEmail,
      passwordHash
    });

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt.toISOString()
    };
  }
}
