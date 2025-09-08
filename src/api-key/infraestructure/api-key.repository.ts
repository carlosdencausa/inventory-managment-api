import { promises as fs } from 'fs';
import * as path from 'path';
import { IApiKeyRepositoryInterface } from '../domain/interfaces/api-key.repository.interface';
import {
  ApiKeyDto,
  CreateApiKeyDto,
  UpdateApiKeyDto,
} from '../domain/dtos/api-key.dtos';
import { ApiKeyEntity } from './entities/api-key.entity';
import { plainToClass, instanceToPlain } from 'class-transformer';

export class ApiKeyRepository implements IApiKeyRepositoryInterface {
  private readonly filePath = path.resolve(
    process.cwd(),
    'database/api_keys.json',
  );

  private async readApiKeys(): Promise<ApiKeyEntity[]> {
    try {
      // Asegurarse de que el directorio database exista
      const dbDir = path.dirname(this.filePath);
      await fs.mkdir(dbDir, { recursive: true }).catch(() => {
        // Ignorar error si el directorio ya existe
      });

      // Intentar acceder al archivo
      try {
        await fs.access(this.filePath);
      } catch {
        // Si el archivo no existe, crear uno vacío
        await fs.writeFile(this.filePath, '[]', 'utf-8');
        return [];
      }
    } catch (error) {
      console.error('Error al preparar la ruta del archivo:', error);
      return [];
    }
    const data = await fs.readFile(this.filePath, 'utf-8');

    // Handle single object or empty file case
    if (!data.trim()) {
      return [];
    }

    const parsed = JSON.parse(data);
    const apiKeysArray = Array.isArray(parsed) ? parsed : [parsed];

    return apiKeysArray.map((apiKeyData: any) =>
      plainToClass(ApiKeyEntity, apiKeyData),
    );
  }

  private async writeApiKeys(apiKeyList: ApiKeyEntity[]): Promise<void> {
    await fs.writeFile(
      this.filePath,
      JSON.stringify(apiKeyList, null, 2),
      'utf-8',
    );
  }

  async save(createApiKeyDto: CreateApiKeyDto): Promise<ApiKeyDto> {
    const apiKeyList = await this.readApiKeys();
    const newApiKeyEntity = plainToClass(
      ApiKeyEntity,
      instanceToPlain(createApiKeyDto),
    );

    newApiKeyEntity.id = apiKeyList.length
      ? Math.max(...apiKeyList.map((apiKey) => apiKey.id)) + 1
      : 1;

    // Generate a UUID for api_key if not provided
    if (!newApiKeyEntity.api_key) {
      throw new Error('API_KEY_NOT_PROVIDED');
    }

    newApiKeyEntity.created_at = new Date();
    newApiKeyEntity.updated_at = null;
    newApiKeyEntity.deleted_at = null;

    apiKeyList.push(newApiKeyEntity);
    await this.writeApiKeys(apiKeyList);
    return plainToClass(ApiKeyDto, instanceToPlain(newApiKeyEntity));
  }

  async update(
    apiKeyId: number,
    updateApiKeyDto: UpdateApiKeyDto,
  ): Promise<ApiKeyDto> {
    const apiKeyList = await this.readApiKeys();
    const apiKeyIndex = apiKeyList.findIndex(
      (apiKey) => apiKey.id === apiKeyId,
    );

    if (apiKeyIndex === -1) {
      throw new Error(`API key with id ${apiKeyId} not found`);
    }

    const updatedApiKey = {
      ...apiKeyList[apiKeyIndex],
      ...updateApiKeyDto,
      updated_at: new Date(),
    };

    apiKeyList[apiKeyIndex] = updatedApiKey;
    await this.writeApiKeys(apiKeyList);
    return plainToClass(ApiKeyDto, instanceToPlain(updatedApiKey));
  }

  async findById(apiKeyId: string): Promise<ApiKeyDto> {
    const apiKeyList = await this.readApiKeys();
    const apiKey = apiKeyList.find((apiKey) => apiKey.id === Number(apiKeyId));

    if (!apiKey) {
      throw new Error(`API key with id ${apiKeyId} not found`);
    }

    return plainToClass(ApiKeyDto, instanceToPlain(apiKey));
  }

  async findByValue(apiKeyValue: string): Promise<ApiKeyDto[]> {
    const apiKeyList = await this.readApiKeys();
    const matchingApiKeys = apiKeyList.filter(
      (apiKey) => apiKey.api_key === apiKeyValue,
    );

    return matchingApiKeys.map((apiKey) =>
      plainToClass(ApiKeyDto, instanceToPlain(apiKey)),
    );
  }

  async softDelete(apiKeyId: string): Promise<ApiKeyDto> {
    const apiKeyList = await this.readApiKeys();
    const apiKeyIndex = apiKeyList.findIndex(
      (apiKey) => apiKey.id === Number(apiKeyId),
    );

    if (apiKeyIndex === -1) {
      throw new Error(`API key with id ${apiKeyId} not found`);
    }

    apiKeyList[apiKeyIndex].deleted_at = new Date();
    await this.writeApiKeys(apiKeyList);
    return plainToClass(ApiKeyDto, instanceToPlain(apiKeyList[apiKeyIndex]));
  }
}
