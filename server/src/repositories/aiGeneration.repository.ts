import type { AIGenerationEntity } from '../types/domain.types';

export class AIGenerationRepository {
  async findById(_id: string): Promise<AIGenerationEntity | null> {
    throw new Error('Not implemented');
  }
}
