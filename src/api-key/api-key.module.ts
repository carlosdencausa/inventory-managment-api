import { Module } from '@nestjs/common';
import { GetApiKeyUseCase } from './application/usecases/get-api-key.usecase';
import { DeleteApiKeyUseCase } from './application/usecases/delete-api-key.usecase';
import { AddApiKeyUseCase } from './application/usecases/add-api-key.usecase';
import { UpdateApiKeyUseCase } from './application/usecases/update-api-key.usecase';
import { ValidateApiKeyUseCase } from './application/usecases/validate-api-key.usecase';
import { ApiKeyRepository } from './infraestructure/api-key.repository';
import { ApiKeyController } from './infraestructure/controllers/api-key.controller';

@Module({
  imports: [],
  controllers: [ApiKeyController],
  providers: [
    {
      provide: 'IApiKeyRepositoryInterface',
      useClass: ApiKeyRepository,
    },
    {
      provide: 'IAddApiKeyUseCaseInterface',
      useClass: AddApiKeyUseCase,
    },
    {
      provide: 'IUpdateApiKeyUseCaseInterface',
      useClass: UpdateApiKeyUseCase,
    },
    {
      provide: 'IDeleteApiKeyUseCaseInterface',
      useClass: DeleteApiKeyUseCase,
    },
    {
      provide: 'IGetApiKeyUseCaseInterface',
      useClass: GetApiKeyUseCase,
    },
    {
      provide: 'IValidateApiKeyUseCaseInterface',
      useClass: ValidateApiKeyUseCase,
    },
  ],
  exports: ['IValidateApiKeyUseCaseInterface', 'IApiKeyRepositoryInterface'],
})
export class ApiKeyModule {}
