import { Injectable, Inject, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ApiKeyDto, CreateApiKeyDto } from '../../domain/dtos/api-key.dtos';
import { IApiKeyRepositoryInterface } from '../../domain/interfaces/api-key.repository.interface';
import { IAddApiKeyUseCaseInterface } from '../../domain/interfaces/usecases/add-api-key.usecase.interface';

@Injectable()
export class AddApiKeyUseCase implements IAddApiKeyUseCaseInterface {
  private readonly logger = new Logger(AddApiKeyUseCase.name);

  constructor(
    @Inject('IApiKeyRepositoryInterface')
    private readonly apiKeyRepository: IApiKeyRepositoryInterface,
  ) {}

  async addApiKey(createApiKeyDto: CreateApiKeyDto): Promise<ApiKeyDto> {
    this.logger.log(`Adding API key: ${JSON.stringify(createApiKeyDto)}`);

    // Generate a UUID if api_key is not provided
    if (!createApiKeyDto.api_key) {
      createApiKeyDto.api_key = randomUUID();
    }

    return this.apiKeyRepository.save(createApiKeyDto);
  }
}
