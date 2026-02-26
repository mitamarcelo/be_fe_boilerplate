import { PrismaClient } from '@prisma/client';
import { User } from '@src/features/auth/domain/entities/user';
import { CreateUserData, UserRepository } from '@src/features/auth/domain/repositories/user-repository';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt
    };
  }

  async create(data: CreateUserData): Promise<User> {
    const normalizedEmail = data.email.toLowerCase();
    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash: data.passwordHash
      }
    });

    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt
    };
  }
}
