import { ApiKeyDto } from '../../dtos/api-key.dtos';

export interface IDeleteApiKeyUseCaseInterface {
  deleteById(apiKeyId: string): Promise<ApiKeyDto>;
}
