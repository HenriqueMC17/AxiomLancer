import { IProjectRepository } from "@/core/domain/ports/repositories/project.repository.port";
import { Project } from "@/core/domain/types";
import { Database } from "@/lib/db";

export class InMemoryProjectRepository implements IProjectRepository {
  public async listByUser(userId: string): Promise<Project[]> {
    return Database.listProjects(userId);
  }

  public async findById(id: string, userId: string): Promise<Project | null> {
    return Database.findProject(id, userId);
  }

  public async create(project: Project): Promise<Project> {
    return Database.createProject(project);
  }

  public async update(id: string, userId: string, data: Partial<Project>): Promise<Project | null> {
    return Database.updateProject(id, userId, data);
  }

  public async delete(id: string, userId: string): Promise<boolean> {
    return Database.deleteProject(id, userId);
  }
}
