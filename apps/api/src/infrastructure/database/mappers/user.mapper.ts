import { User as PrismaUserModel } from '@prisma/client';
import { User, TaxRegime } from '../../../domain/entities/user.entity';
import { Decimal } from 'decimal.js';

export class UserMapper {
  public static toDomain(raw: PrismaUserModel): User {
    return new User({
      id: raw.id,
      email: raw.email,
      passwordHash: '',
      name: raw.name,
      taxId: '',
      taxRegime: 'SIMPLES_NACIONAL' as TaxRegime,
      defaultTaxRate: new Decimal('0.0600'),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt || undefined,
    });
  }

  public static toPersistence(entity: User): Record<string, unknown> {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
