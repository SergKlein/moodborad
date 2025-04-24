import { IGenerationService } from "./generation.service";
import { GenerationParams, GenerationResult } from "./generation.service";

export const openaiGenerationService: IGenerationService = {
    async generate(generationInput: GenerationParams): Promise<GenerationResult> {
        console.log("Generation request received:", generationInput);
        // Implementation to be added based on the specific type
        // Example: Check generationInput.type and call appropriate internal handler
        throw new Error('Generation method not implemented yet.');
    },
}
