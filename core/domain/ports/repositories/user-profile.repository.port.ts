import { UserProfile } from "@/core/domain/types";

/**
 * Port (interface) para o repositorio de Perfis de Usuario (Multi-tenant).
 * Segue o padrao Ports & Adapters (Hexagonal Architecture).
 */
export interface IUserProfileRepository {
  findByUserId(userId: string): Promise<UserProfile | null>;
  update(userId: string, data: Partial<UserProfile>): Promise<UserProfile>;
}
