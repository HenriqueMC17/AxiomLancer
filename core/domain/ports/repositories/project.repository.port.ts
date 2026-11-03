import { Project } from "@/core/domain/types";

/**
 * Port (interface) para o repositorio de Projetos do Portfolio.
 * Segue o padrao Ports & Adapters (Hexagonal Architecture).
 */
export interface IProjectRepository {
  listByUser(userId: string): Promise<Project[]>;
  findById(id: string, userId: string): Promise<Project | null>;
  create(project: Project): Promise<Project>;
  update(id: string, userId: string, data: Partial<Project>): Promise<Project | null>;
  delete(id: string, userId: string): Promise<boolean>;
}
