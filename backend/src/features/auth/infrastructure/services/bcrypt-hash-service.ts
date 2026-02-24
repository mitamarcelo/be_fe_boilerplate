import bcrypt from 'bcrypt';
import { HashService } from '@src/features/auth/application/ports/hash-service';

export class BcryptHashService implements HashService {
  constructor(private readonly saltRounds = 10) {}

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.saltRounds);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
