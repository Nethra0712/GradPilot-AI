import type { AIGenerationEntity } from '../types/domain.types';

export class AIGenerationService {
  async getGenerationById(_id: string): Promise<AIGenerationEntity | null> {
    throw new Error('Not implemented');
  }
}
