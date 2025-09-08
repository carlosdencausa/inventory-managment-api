import { Injectable, Inject, Logger } from '@nestjs/common';
import { ApiKeyDto } from '../../domain/dtos/api-key.dtos';
import { IApiKeyRepositoryInterface } from '../../domain/interfaces/api-key.repository.interface';
import { IGetApiKeyUseCaseInterface } from '../../domain/interfaces/usecases/get-api-key.usecase.interface';

@Injectable()
export class GetApiKeyUseCase implements IGetApiKeyUseCaseInterface {
  private readonly logger = new Logger(GetApiKeyUseCase.name);

  constructor(
    @Inject('IApiKeyRepositoryInterface')
    private readonly apiKeyRepository: IApiKeyRepositoryInterface,
  ) {}

  async getById(apiKeyId: string): Promise<ApiKeyDto> {
    this.logger.log(`Fetching API key with id: ${apiKeyId}`);
    return this.apiKeyRepository.findById(apiKeyId);
  }
}
