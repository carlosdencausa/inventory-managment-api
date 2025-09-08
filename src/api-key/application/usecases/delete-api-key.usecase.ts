import { Injectable, Inject, Logger } from '@nestjs/common';
import { ApiKeyDto } from '../../domain/dtos/api-key.dtos';
import { IApiKeyRepositoryInterface } from '../../domain/interfaces/api-key.repository.interface';
import { IDeleteApiKeyUseCaseInterface } from '../../domain/interfaces/usecases/delete-api-key.usecase.interface';

@Injectable()
export class DeleteApiKeyUseCase implements IDeleteApiKeyUseCaseInterface {
  private readonly logger = new Logger(DeleteApiKeyUseCase.name);

  constructor(
    @Inject('IApiKeyRepositoryInterface')
    private readonly apiKeyRepository: IApiKeyRepositoryInterface,
  ) {}

  async deleteById(apiKeyId: string): Promise<ApiKeyDto> {
    this.logger.log(`Deleting API key with id: ${apiKeyId}`);
    return this.apiKeyRepository.softDelete(apiKeyId);
  }
}
