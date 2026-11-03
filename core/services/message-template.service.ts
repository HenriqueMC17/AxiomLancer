import { IMessageTemplateRepository } from "@/core/domain/ports/repositories/message-template.repository.port";
import { MessageTemplate, ChannelType, ToneOfVoice } from "@/core/domain/types";
import {
  CreateMessageTemplateInput,
  UpdateMessageTemplateInput,
  createMessageTemplateSchema,
  updateMessageTemplateSchema,
} from "@/core/domain/schemas";
import { ValidationError, NotFoundError } from "@/core/errors/app-error";

export interface RenderVariables {
  client_name?: string;
  invoice_number?: string;
  gross_value?: string;
  due_date?: string;
  pix_key?: string;
  [key: string]: string | undefined;
}

/**
 * Service de Dominio para Gerenciamento de Templates de Mensagem.
 * Isola estritamente as regras de negocio da camada de transporte (HTTP/Next.js/Fastify).
 *
 * Principios:
 * - Fail Fast: Valida contratos Zod antes de qualquer operacao.
 * - Zero Trust: Exige userId validado e aplica isolamento estrito de inquilino.
 * - Single Responsibility: Encapsula interpolacao de variaveis e sanitizacao de templates.
 */
export class MessageTemplateService {
  constructor(private readonly repository: IMessageTemplateRepository) {}

  public async listByUser(userId: string): Promise<MessageTemplate[]> {
    if (!userId || userId.trim() === "") {
      throw new ValidationError("Identificador de usuario obrigatorio");
    }
    return this.repository.listByUser(userId);
  }

  public async getById(id: string, userId: string): Promise<MessageTemplate> {
    if (!id || !userId) {
      throw new ValidationError("ID do template e do usuario sao obrigatorios");
    }
    const template = await this.repository.findById(id, userId);
    if (!template) {
      throw new NotFoundError("Template de Mensagem", id);
    }
    return template;
  }

  public async create(userId: string, input: CreateMessageTemplateInput): Promise<MessageTemplate> {
    if (!userId || userId.trim() === "") {
      throw new ValidationError("Identificador de usuario obrigatorio");
    }

    const parsed = createMessageTemplateSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError(
        "Dados do template invalidos",
        parsed.error.flatten()
      );
    }

    const newTemplate: MessageTemplate = {
      id: `tmpl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: userId,
      channel: parsed.data.channel as ChannelType,
      tone_of_voice: parsed.data.tone_of_voice as ToneOfVoice,
      subject: parsed.data.subject.trim(),
      body: parsed.data.body.trim(),
    };

    return this.repository.create(newTemplate);
  }

  public async update(
    id: string,
    userId: string,
    input: UpdateMessageTemplateInput
  ): Promise<MessageTemplate> {
    if (!id || !userId) {
      throw new ValidationError("ID do template e do usuario sao obrigatorios");
    }

    const parsed = updateMessageTemplateSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError(
        "Dados de atualizacao do template invalidos",
        parsed.error.flatten()
      );
    }

    // Sanitiza strings se presentes
    const sanitizedData: Partial<MessageTemplate> = { ...parsed.data };
    if (sanitizedData.subject) sanitizedData.subject = sanitizedData.subject.trim();
    if (sanitizedData.body) sanitizedData.body = sanitizedData.body.trim();

    const updated = await this.repository.update(id, userId, sanitizedData);
    if (!updated) {
      throw new NotFoundError("Template de Mensagem", id);
    }

    return updated;
  }

  public async delete(id: string, userId: string): Promise<boolean> {
    if (!id || !userId) {
      throw new ValidationError("ID do template e do usuario sao obrigatorios");
    }

    const deleted = await this.repository.delete(id, userId);
    if (!deleted) {
      throw new NotFoundError("Template de Mensagem", id);
    }
    return true;
  }

  /**
   * Interpola variaveis dinamicamente no corpo e assunto do template
   * Ex: {{client_name}} -> "Acme Corp"
   */
  public render(template: MessageTemplate, variables: RenderVariables): { subject: string; body: string } {
    let renderedSubject = template.subject;
    let renderedBody = template.body;

    for (const [key, val] of Object.entries(variables)) {
      if (val !== undefined) {
        const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, "g");
        renderedSubject = renderedSubject.replace(placeholder, val);
        renderedBody = renderedBody.replace(placeholder, val);
      }
    }

    return {
      subject: renderedSubject,
      body: renderedBody,
    };
  }
}