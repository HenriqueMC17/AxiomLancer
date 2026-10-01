import { Project } from '../entities/project.entity';

export interface IProjectRepository {
  findById(id: string): Promise<Project | null>;
  findByUserId(userId: string): Promise<Project[]>;
  findByClientId(clientId: string): Promise<Project[]>;
  save(project: Project): Promise<void>;
}
