import { ApiKeyDto } from '../../dtos/api-key.dtos';

export interface IValidateApiKeyUseCaseInterface {
  validateApiKey(apiKeyValue: string): Promise<ApiKeyDto | null>;
}
