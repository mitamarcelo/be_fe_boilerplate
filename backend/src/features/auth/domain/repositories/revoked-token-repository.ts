export interface CreateRevokedTokenData {
  token: string;
  expiresAt: Date;
  revokedAt: Date;
}

export interface RevokedTokenRepository {
  create(data: CreateRevokedTokenData): Promise<void>;
  isRevoked(token: string): Promise<boolean>;
  removeExpired(now: Date): Promise<void>;
}
