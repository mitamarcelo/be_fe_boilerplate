import { PrismaClient } from '@prisma/client';
import { CreateRevokedTokenData, RevokedTokenRepository } from '@src/features/auth/domain/repositories/revoked-token-repository';

export class PrismaRevokedTokenRepository implements RevokedTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateRevokedTokenData): Promise<void> {
    await this.prisma.revokedToken.create({
      data: {
        token: data.token,
        revokedAt: data.revokedAt,
        expiresAt: data.expiresAt
      }
    });
  }

  async isRevoked(token: string): Promise<boolean> {
    const record = await this.prisma.revokedToken.findFirst({
      where: { token }
    });

    return Boolean(record);
  }

  async removeExpired(now: Date): Promise<void> {
    await this.prisma.revokedToken.deleteMany({
      where: {
        expiresAt: { lt: now }
      }
    });
  }
}
