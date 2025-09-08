import { Injectable, Inject, Logger } from '@nestjs/common';
import { ApiKeyDto, UpdateApiKeyDto } from '../../domain/dtos/api-key.dtos';
import { IApiKeyRepositoryInterface } from '../../domain/interfaces/api-key.repository.interface';
import { IUpdateApiKeyUseCaseInterface } from '../../domain/interfaces/usecases/update-api-key.usecase.interface';

@Injectable()
export class UpdateApiKeyUseCase implements IUpdateApiKeyUseCaseInterface {
  private readonly logger = new Logger(UpdateApiKeyUseCase.name);

  constructor(
    @Inject('IApiKeyRepositoryInterface')
    private readonly apiKeyRepository: IApiKeyRepositoryInterface,
  ) {}

  async updateApiKey(
    apiKeyId: number,
    updateApiKeyDto: UpdateApiKeyDto,
  ): Promise<ApiKeyDto> {
    this.logger.log(
      `Updating API key with id: ${apiKeyId}, data: ${JSON.stringify(
        updateApiKeyDto,
      )}`,
    );
    return this.apiKeyRepository.update(apiKeyId, updateApiKeyDto);
  }
}
