import { Project } from "@/core/domain/types";
import {
  CreateProjectInput,
  UpdateProjectInput,
  createProjectSchema,
  updateProjectSchema,
} from "@/core/domain/schemas";
import { Database } from "@/lib/db";
import { ValidationError, NotFoundError } from "@/core/errors/app-error";

/**
 * Service de Dominio para Gerenciamento de Projetos e Portfolio do Freelancer.
 *
 * Principios:
 * - Fail Fast: Valida consistencia temporal (start_date <= end_date) e regras Zod na borda.
 * - Zero Trust: Isolamento estrito por userId.
 * - LGPD Compliance: Mascara o nome da empresa se `is_public_client_name` for falso.
 * - "Em desenvolvimento": Aceita `end_date` nulo de forma deterministica.
 */
export class ProjectService {
  public async listByUser(userId: string): Promise<Project[]> {
    if (!userId || userId.trim() === "") {
      throw new ValidationError("Identificador de usuario obrigatorio");
    }
    return Database.listProjects(userId);
  }

  public async getById(id: string, userId: string): Promise<Project> {
    if (!id || !userId) {
      throw new ValidationError("ID do projeto e do usuario sao obrigatorios");
    }
    const project = Database.findProject(id, userId);
    if (!project) {
      throw new NotFoundError("Projeto", id);
    }
    return project;
  }

  public async create(userId: string, input: CreateProjectInput): Promise<Project> {
    if (!userId || userId.trim() === "") {
      throw new ValidationError("Identificador de usuario obrigatorio");
    }

    const parsed = createProjectSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError("Dados do projeto invalidos", parsed.error.flatten());
    }

    // Se estiver em desenvolvimento, end_date e estritamente nulo
    const finalEndDate = parsed.data.is_in_development ? null : (parsed.data.end_date || null);

    const newProject: Project = {
      id: `prj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: userId,
      client_id: parsed.data.client_id,
      name: parsed.data.name.trim(),
      description: parsed.data.description?.trim(),
      start_date: parsed.data.start_date,
      end_date: finalEndDate,
      is_public_client_name: parsed.data.is_public_client_name ?? false,
      created_at: new Date().toISOString(),
    };

    const created = Database.createProject(newProject);
    return Database.findProject(created.id, userId) ?? created;
  }

  public async update(id: string, userId: string, input: UpdateProjectInput): Promise<Project> {
    if (!id || !userId) {
      throw new ValidationError("ID do projeto e do usuario sao obrigatorios");
    }

    const parsed = updateProjectSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError("Dados de atualizacao do projeto invalidos", parsed.error.flatten());
    }

    const current = Database.findProject(id, userId);
    if (!current) {
      throw new NotFoundError("Projeto", id);
    }

    const updatePayload: Partial<Project> = { ...parsed.data };
    if (parsed.data.name) updatePayload.name = parsed.data.name.trim();
    if (parsed.data.description !== undefined) updatePayload.description = parsed.data.description?.trim();

    if (parsed.data.is_in_development === true) {
      updatePayload.end_date = null;
    } else if (parsed.data.end_date !== undefined) {
      updatePayload.end_date = parsed.data.end_date;
    }

    const updated = Database.updateProject(id, userId, updatePayload);
    if (!updated) {
      throw new NotFoundError("Projeto", id);
    }

    return Database.findProject(id, userId) ?? updated;
  }

  public async delete(id: string, userId: string): Promise<boolean> {
    if (!id || !userId) {
      throw new ValidationError("ID do projeto e do usuario sao obrigatorios");
    }

    const deleted = Database.deleteProject(id, userId);
    if (!deleted) {
      throw new NotFoundError("Projeto", id);
    }
    return true;
  }
}