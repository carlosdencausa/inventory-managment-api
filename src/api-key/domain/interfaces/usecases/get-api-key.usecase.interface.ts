import { ApiKeyDto } from '../../dtos/api-key.dtos';

export interface IGetApiKeyUseCaseInterface {
  getById(apiKeyId: string): Promise<ApiKeyDto>;
}
