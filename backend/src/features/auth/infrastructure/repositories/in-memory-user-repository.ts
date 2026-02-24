import { randomUUID } from 'crypto';
import { User } from '@src/features/auth/domain/entities/user';
import { CreateUserData, UserRepository } from '@src/features/auth/domain/repositories/user-repository';

export class InMemoryUserRepository implements UserRepository {
  private readonly usersByEmail = new Map<string, User>();

  async findByEmail(email: string): Promise<User | null> {
    return this.usersByEmail.get(email.toLowerCase()) ?? null;
  }

  async create(data: CreateUserData): Promise<User> {
    const normalizedEmail = data.email.toLowerCase();
    const user: User = {
      id: randomUUID(),
      email: normalizedEmail,
      passwordHash: data.passwordHash,
      createdAt: new Date()
    };

    this.usersByEmail.set(normalizedEmail, user);
    return user;
  }
}
