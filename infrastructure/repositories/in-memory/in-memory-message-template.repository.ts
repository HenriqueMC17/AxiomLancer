import { IMessageTemplateRepository } from "@/core/domain/ports/repositories/message-template.repository.port";
import { MessageTemplate } from "@/core/domain/types";
import { Database } from "@/lib/db";

/**
 * Adaptador in-memory para IMessageTemplateRepository.
 * Zero Trust: todos os metodos filtram estritamente por userId.
 * Isolation garantida: nenhum usuario acessa dados de outro.
 */
export class InMemoryMessageTemplateRepository implements IMessageTemplateRepository {
  public async listByUser(userId: string): Promise<MessageTemplate[]> {
    return Database.listMessageTemplates(userId);
  }

  public async findById(id: string, userId: string): Promise<MessageTemplate | null> {
    return Database.findMessageTemplate(id, userId);
  }

  public async create(template: MessageTemplate): Promise<MessageTemplate> {
    return Database.createMessageTemplate(template);
  }

  public async update(
    id: string,
    userId: string,
    data: Partial<MessageTemplate>
  ): Promise<MessageTemplate | null> {
    return Database.updateMessageTemplate(id, userId, data);
  }

  public async delete(id: string, userId: string): Promise<boolean> {
    return Database.deleteMessageTemplate(id, userId);
  }
}