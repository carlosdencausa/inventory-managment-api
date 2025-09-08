import { ApiKeyDto, CreateApiKeyDto } from '../../dtos/api-key.dtos';

export interface IAddApiKeyUseCaseInterface {
  addApiKey(createApiKeyDto: CreateApiKeyDto): Promise<ApiKeyDto>;
}
