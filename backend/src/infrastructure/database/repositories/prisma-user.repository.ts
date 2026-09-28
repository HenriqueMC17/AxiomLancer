import { PrismaClient, Prisma } from '@prisma/client';
import { IUserRepository } from '../../../domain/repositories/user-repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

  public async findById(id: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { id } });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { email } });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  public async findByTaxId(taxId: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { taxId } });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  public async save(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);
    await this.prisma.user.create({
      data: data as unknown as Prisma.UserCreateInput,
    });
  }
}
