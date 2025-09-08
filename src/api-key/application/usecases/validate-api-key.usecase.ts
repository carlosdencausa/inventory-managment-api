import { Inject, Injectable, Logger } from '@nestjs/common';
import { IValidateApiKeyUseCaseInterface } from '../../domain/interfaces/usecases/validate-api-key.usecase.interface';
import { IApiKeyRepositoryInterface } from '../../domain/interfaces/api-key.repository.interface';
import { ApiKeyDto } from '../../domain/dtos/api-key.dtos';

@Injectable()
export class ValidateApiKeyUseCase implements IValidateApiKeyUseCaseInterface {
  private readonly logger = new Logger(ValidateApiKeyUseCase.name);

  constructor(
    @Inject('IApiKeyRepositoryInterface')
    private readonly apiKeyRepository: IApiKeyRepositoryInterface,
  ) {}

  /**
   * Validates if an API key is valid and not revoked
   * @param apiKeyValue The API key value to validate
   * @returns The validated API key or null if invalid
   */
  async validateApiKey(apiKeyValue: string): Promise<ApiKeyDto | null> {
    try {
      this.logger.log(`Validating API key: ${apiKeyValue}`);

      // Find API keys that match the provided value
      const apiKeys = await this.apiKeyRepository.findByValue(apiKeyValue);

      if (!apiKeys || apiKeys.length === 0) {
        this.logger.warn(`API key not found: ${apiKeyValue}`);
        return null;
      }

      // Filter only API keys that are not soft-deleted
      const validApiKeys = apiKeys.filter((apiKey) => !apiKey.deleted_at);

      if (validApiKeys.length === 0) {
        this.logger.warn(`Revoked API key: ${apiKeyValue}`);
        return null;
      }
      return validApiKeys[0];
    } catch (error) {
      this.logger.error(`Error validating API key: ${error.message}`);
      return null;
    }
  }
}
