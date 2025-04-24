import { db } from '@/lib/db';
import {
  generationPrompts as generationPromptsSchema,
  GenerationPrompt,
  generationToolTypeEnum,
  generationDesignTypeEnum,
  generationPromptRoleEnum,
  NewGenerationPrompt,
} from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// Keep local type definitions
export type ToolType = typeof generationToolTypeEnum.enumValues[number];
export type DesignType = typeof generationDesignTypeEnum.enumValues[number];
export type PromptRole = typeof generationPromptRoleEnum.enumValues[number];

// Interface for the generic data passed for template filling
export type PromptData = Record<string, any>; // Use Record<string, any> for flexibility

// Interface for the result of prompt construction
export interface ConstructedPrompt {
    finalPrompt: string;
    negativePrompt: string | null;
}

/**
 * Prompts Service Interface
 */
export interface IPromptService {
  getPromptByName(name: string): Promise<GenerationPrompt | null>;
  getActivePromptsByType(
    toolType: ToolType,
    designType?: DesignType,
    role?: PromptRole
  ): Promise<GenerationPrompt[]>;
  createPrompt(promptData: NewGenerationPrompt): Promise<GenerationPrompt | null>;
  constructPrompt(
    toolType: ToolType,
    designType: DesignType | undefined,
    data: PromptData
  ): Promise<ConstructedPrompt>;
}

/**
 * Simple template filler function
 */
function fillTemplate(template: string, data: PromptData): string {
    const processedData: Record<string, string> = {};
    for (const key in data) {
        if (Array.isArray(data[key])) {
            // Fix: Added type annotation for c
            processedData[key] = (data[key] as any[]).map((c: any) => String(c).trim()).join(', ');
        } else if (data[key] !== null && data[key] !== undefined) {
            processedData[key] = String(data[key]);
        }
    }
    let filled = template.replace(/\{(\w+)\}/g, (match, key) => {
        return processedData.hasOwnProperty(key) ? processedData[key] : match;
    });
    return filled;
}

/**
 * Prompts Service Implementation
 */
export const promptService: IPromptService = {
  async getPromptByName(name: string): Promise<GenerationPrompt | null> {
    try {
      const result = await db.query.generationPrompts.findFirst({
        where: and(
          eq(generationPromptsSchema.generationPrompts.name, name),
          eq(generationPromptsSchema.generationPrompts.isActive, true)
        ),
      });
      return result ?? null;
    } catch (error) {
      console.error(`Error fetching prompt by name "${name}":`, error);
      return null;
    }
  },

  async getActivePromptsByType(
    toolType: ToolType,
    designType?: DesignType,
    role?: PromptRole
  ): Promise<GenerationPrompt[]> {
     try {
      const conditions = [
          eq(schema.generationPrompts.isActive, true),
          eq(schema.generationPrompts.toolType, toolType)
      ];
      if (designType) conditions.push(eq(schema.generationPrompts.designType, designType));
      if (role) conditions.push(eq(schema.generationPrompts.role, role));

      const results = await db.query.generationPrompts.findMany({
        where: and(...conditions),
        orderBy: (prompts, { asc }) => [asc(schema.generationPrompts.id)]
      });
      return results;
    } catch (error) {
      console.error(`Error fetching prompts by type (${toolType}, ${designType}, ${role}):`, error);
      return [];
    }
  },

  async createPrompt(promptData: NewGenerationPrompt): Promise<GenerationPrompt | null> {
    try {
        const result = await db.insert(schema.generationPrompts)
            .values(promptData)
            .returning();
        return result[0] ?? null;
    } catch (error) {
        console.error("Error creating prompt:", error);
        return null;
    }
  },

  async constructPrompt(
    toolType: ToolType,
    designType: DesignType | undefined,
    data: PromptData
  ): Promise<ConstructedPrompt> {

    const systemPrompts = await this.getActivePromptsByType(toolType, designType, 'system');
    const systemPromptsGeneral = systemPrompts.length === 0
        ? await this.getActivePromptsByType(toolType, undefined, 'system')
        : [];
    const userPrompts = await this.getActivePromptsByType(toolType, designType, 'user');
    const userPromptsGeneral = userPrompts.length === 0
        ? await this.getActivePromptsByType(toolType, undefined, 'user')
        : [];

    const systemTemplate = systemPrompts[0] ?? systemPromptsGeneral[0];
    const userTemplate = userPrompts[0] ?? userPromptsGeneral[0];

    if (!userTemplate) {
        throw new Error(`Could not find active 'user' role prompt template for toolType: ${toolType}`);
    }

    const systemPromptStr = systemTemplate ? fillTemplate(systemTemplate.promptTemplate, data) : '';
    const userPromptStr = fillTemplate(userTemplate.promptTemplate, data);
    const negativePromptBase = systemTemplate?.negativePrompt || userTemplate?.negativePrompt || null;

    let finalPrompt = userPromptStr;
    if (systemPromptStr) {
        finalPrompt = `${systemPromptStr}\n\n${userPromptStr}`;
    }

    return {
        finalPrompt: finalPrompt.trim(),
        negativePrompt: negativePromptBase ? fillTemplate(negativePromptBase, data) : null
    };
  }
};
