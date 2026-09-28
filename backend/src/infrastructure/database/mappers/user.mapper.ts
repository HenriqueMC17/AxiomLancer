import { User as PrismaUserModel } from '@prisma/client';
import { User, TaxRegime } from '../../../domain/entities/user.entity';
import { Decimal } from 'decimal.js';

export class UserMapper {
  public static toDomain(raw: PrismaUserModel): User {
    return new User({
      id: raw.id,
      email: raw.email,
      passwordHash: raw.passwordHash,
      name: raw.name,
      taxId: raw.taxId,
      taxRegime: raw.taxRegime as TaxRegime,
      defaultTaxRate: new Decimal(raw.defaultTaxRate.toString()),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  public static toPersistence(entity: User): Record<string, unknown> {
    return {
      id: entity.id,
      email: entity.email,
      passwordHash: (entity as unknown as { props: { passwordHash: string } }).props?.passwordHash || '',
      name: entity.name,
      taxId: entity.taxId,
      taxRegime: entity.taxRegime,
      defaultTaxRate: entity.defaultTaxRate.toFixed(4),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
