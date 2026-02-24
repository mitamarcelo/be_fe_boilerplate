import { UnauthorizedError } from '@src/shared/domain/errors/app-error';
import { LoginRequestDto, LoginResponseDto } from '@src/features/auth/application/dto/auth.dto';
import { HashService } from '@src/features/auth/application/ports/hash-service';
import { TokenService } from '@src/features/auth/application/ports/token-service';
import { UserRepository } from '@src/features/auth/application/ports/user-repository';

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService
  ) {}

  async execute(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const passwordMatches = await this.hashService.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const accessToken = await this.tokenService.signAccessToken({
      sub: user.id,
      email: user.email
    });

    return { accessToken };
  }
}
