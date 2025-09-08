import {
  ApiKeyDto,
  CreateApiKeyDto,
  UpdateApiKeyDto,
} from '../dtos/api-key.dtos';

export interface IApiKeyRepositoryInterface {
  save(createApiKeyDto: CreateApiKeyDto): Promise<ApiKeyDto>;
  update(
    apiKeyId: number,
    updateApiKeyDto: UpdateApiKeyDto,
  ): Promise<ApiKeyDto>;
  findById(apiKeyId: string): Promise<ApiKeyDto>;
  findByValue(apiKeyValue: string): Promise<ApiKeyDto[]>;
  softDelete(apiKeyId: string): Promise<ApiKeyDto>;
}
