import { ApiKeyDto, UpdateApiKeyDto } from '../../dtos/api-key.dtos';

export interface IUpdateApiKeyUseCaseInterface {
  updateApiKey(
    apiKeyId: number,
    updateApiKeyDto: UpdateApiKeyDto,
  ): Promise<ApiKeyDto>;
}
