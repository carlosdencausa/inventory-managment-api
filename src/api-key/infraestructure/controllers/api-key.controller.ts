import {
  Controller,
  Inject,
  Logger,
  Post,
  Param,
  Body,
  Put,
  BadRequestException,
  Get,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ApiKeyAuth } from '../../../common/decorators/api-key-auth.decorator';
import {
  ApiKeyDto,
  CreateApiKeyDto,
  UpdateApiKeyDto,
} from '../../domain/dtos/api-key.dtos';
import { IGetApiKeyUseCaseInterface } from '../../domain/interfaces/usecases/get-api-key.usecase.interface';
import { IDeleteApiKeyUseCaseInterface } from '../../domain/interfaces/usecases/delete-api-key.usecase.interface';
import { IAddApiKeyUseCaseInterface } from '../../domain/interfaces/usecases/add-api-key.usecase.interface';
import { IUpdateApiKeyUseCaseInterface } from '../../domain/interfaces/usecases/update-api-key.usecase.interface';

/**
 * Controller for managing API keys.
 */
@ApiTags('API Keys')
@Controller('api-keys')
export class ApiKeyController {
  private readonly logger = new Logger(ApiKeyController.name);

  constructor(
    @Inject('IGetApiKeyUseCaseInterface')
    private readonly getApiKeyUseCase: IGetApiKeyUseCaseInterface,
    @Inject('IDeleteApiKeyUseCaseInterface')
    private readonly deleteApiKeyUseCase: IDeleteApiKeyUseCaseInterface,
    @Inject('IAddApiKeyUseCaseInterface')
    private readonly addApiKeyUseCase: IAddApiKeyUseCaseInterface,
    @Inject('IUpdateApiKeyUseCaseInterface')
    private readonly updateApiKeyUseCase: IUpdateApiKeyUseCaseInterface,
  ) {}

  /**
   * Get an API key by its id
   */
  @ApiOkResponse({ description: 'API key found', type: ApiKeyDto })
  @ApiBadRequestResponse({ description: 'API key not found' })
  @ApiKeyAuth()
  @Get('get/:id')
  async getApiKey(@Param('id') apiKeyId: string): Promise<ApiKeyDto> {
    this.logger.log(`Getting API key with id: ${apiKeyId}`);
    try {
      return await this.getApiKeyUseCase.getById(apiKeyId);
    } catch (error) {
      this.logger.error(`Error getting API key: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Create a new API key
   */
  @ApiCreatedResponse({ description: 'API key created', type: ApiKeyDto })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiKeyAuth()
  @Post()
  async addApiKey(
    @Body() createApiKeyDto: CreateApiKeyDto,
  ): Promise<ApiKeyDto> {
    this.logger.log(
      `Creating a new API key: ${JSON.stringify(createApiKeyDto)}`,
    );
    try {
      return await this.addApiKeyUseCase.addApiKey(createApiKeyDto);
    } catch (error) {
      this.logger.error(`Error creating API key: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Update an API key by its id
   */
  @ApiOkResponse({ description: 'API key updated', type: ApiKeyDto })
  @ApiBadRequestResponse({ description: 'API key not found or invalid input' })
  @ApiKeyAuth()
  @Put(':id')
  async updateApiKey(
    @Param('id') apiKeyId: number,
    @Body() updateApiKeyDto: UpdateApiKeyDto,
  ): Promise<ApiKeyDto> {
    this.logger.log(
      `Updating API key with id: ${apiKeyId}, data: ${JSON.stringify(
        updateApiKeyDto,
      )}`,
    );
    try {
      return await this.updateApiKeyUseCase.updateApiKey(
        apiKeyId,
        updateApiKeyDto,
      );
    } catch (error) {
      this.logger.error(`Error updating API key: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Soft delete an API key by its id
   */
  @ApiOkResponse({ description: 'API key soft deleted', type: ApiKeyDto })
  @ApiBadRequestResponse({ description: 'API key not found' })
  @ApiKeyAuth()
  @Delete('delete/:id')
  async softDeleteApiKey(@Param('id') apiKeyId: string): Promise<ApiKeyDto> {
    this.logger.log(`Soft deleting API key with id: ${apiKeyId}`);
    try {
      return await this.deleteApiKeyUseCase.deleteById(apiKeyId);
    } catch (error) {
      this.logger.error(`Error soft deleting API key: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }
}
