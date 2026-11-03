import { MessageTemplate } from "@/core/domain/types";

/**
 * Port (interface) para o repositorio de Message Templates.
 * Segue o padrao Ports & Adapters (Hexagonal Architecture).
 * Nenhuma dependencia de infraestrutura -- apenas contratos puros.
 */
export interface IMessageTemplateRepository {
  listByUser(userId: string): Promise<MessageTemplate[]>;
  findById(id: string, userId: string): Promise<MessageTemplate | null>;
  create(template: MessageTemplate): Promise<MessageTemplate>;
  update(id: string, userId: string, data: Partial<MessageTemplate>): Promise<MessageTemplate | null>;
  delete(id: string, userId: string): Promise<boolean>;
}