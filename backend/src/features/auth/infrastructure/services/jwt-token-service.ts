import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { UnauthorizedError } from '@src/shared/domain/errors/app-error';
import { AccessTokenPayload } from '@src/features/auth/application/dto/access-token-payload';
import { TokenService } from '@src/features/auth/application/ports/token-service';

export class JwtTokenService implements TokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string
  ) {}

  async signAccessToken(payload: AccessTokenPayload): Promise<string> {
    const options: SignOptions = { expiresIn: this.expiresIn as SignOptions['expiresIn'] };
    return jwt.sign(payload, this.secret, options);
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    try {
      const decoded = jwt.verify(token, this.secret) as JwtPayload | string;
      if (!decoded || typeof decoded === 'string') {
        throw new UnauthorizedError('Invalid token');
      }

      const subject = decoded.sub;
      const email = decoded.email;
      const exp = decoded.exp;

      if (typeof subject !== 'string' || typeof email !== 'string' || typeof exp !== 'number') {
        throw new UnauthorizedError('Invalid token payload');
      }

      return {
        sub: subject,
        email,
        exp
      };
    } catch (_error) {
      throw new UnauthorizedError('Invalid token');
    }
  }
}
