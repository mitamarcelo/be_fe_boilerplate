import { AccessTokenPayload } from '@src/features/auth/application/dto/access-token-payload';

export interface TokenService {
  signAccessToken(payload: AccessTokenPayload): Promise<string>;
  verifyAccessToken(token: string): Promise<AccessTokenPayload>;
}
