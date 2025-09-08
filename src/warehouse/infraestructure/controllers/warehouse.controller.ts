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
  WarehouseDto,
  CreateWarehouseDto,
  UpdateWarehouseDto,
} from '../../domain/dtos/warehouse.dtos';
import { IGetWarehouseUseCaseInterface } from '../../domain/interfaces/usecases/get-warehouse.usecase.interface';
import { IDeleteWarehouseUseCaseInterface } from '../../domain/interfaces/usecases/delete-warehouse.usecase.interface';
import { IAddWarehouseUseCaseInterface } from '../../domain/interfaces/usecases/add-warehouse.usecase.interface';
import { IUpdateWarehouseUseCaseInterface } from '../../domain/interfaces/usecases/update-warehouse.usecase.interface';

@ApiTags('Warehouses')
@Controller('warehouses')
export class WarehouseController {
  private readonly logger = new Logger(WarehouseController.name);

  /**
   * Constructor
   *
   * @param getWarehouseUseCase Use case for retrieving warehouse information
   * @param deleteWarehouseUseCase Use case for deleting warehouses
   * @param addWarehouseUseCase Use case for adding new warehouses
   * @param updateWarehouseUseCase Use case for updating warehouses
   */
  constructor(
    @Inject('IGetWarehouseUseCaseInterface')
    private readonly getWarehouseUseCase: IGetWarehouseUseCaseInterface,
    @Inject('IDeleteWarehouseUseCaseInterface')
    private readonly deleteWarehouseUseCase: IDeleteWarehouseUseCaseInterface,
    @Inject('IAddWarehouseUseCaseInterface')
    private readonly addWarehouseUseCase: IAddWarehouseUseCaseInterface,
    @Inject('IUpdateWarehouseUseCaseInterface')
    private readonly updateWarehouseUseCase: IUpdateWarehouseUseCaseInterface,
  ) {}

  /**
   * Get a warehouse by its id
   */
  @ApiOkResponse({ description: 'Warehouse found', type: WarehouseDto })
  @ApiBadRequestResponse({ description: 'Warehouse not found' })
  @ApiKeyAuth()
  @Get('get/:id')
  async getWarehouse(@Param('id') warehouseId: string): Promise<WarehouseDto> {
    this.logger.log(`Getting warehouse with id: ${warehouseId}`);
    try {
      return await this.getWarehouseUseCase.getById(warehouseId);
    } catch (error) {
      this.logger.error(`Error getting warehouse: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Create a new warehouse
   */
  @ApiCreatedResponse({ description: 'Warehouse created', type: WarehouseDto })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiKeyAuth()
  @Post()
  async addWarehouse(
    @Body() createWarehouseDto: CreateWarehouseDto,
  ): Promise<WarehouseDto> {
    this.logger.log(
      `Creating a new warehouse: ${JSON.stringify(createWarehouseDto)}`,
    );
    try {
      return await this.addWarehouseUseCase.addWarehouse(createWarehouseDto);
    } catch (error) {
      this.logger.error(`Error creating warehouse: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Update a warehouse by its id
   */
  @ApiOkResponse({ description: 'Warehouse updated', type: WarehouseDto })
  @ApiBadRequestResponse({
    description: 'Warehouse not found or invalid input',
  })
  @ApiKeyAuth()
  @Put(':id')
  async updateWarehouse(
    @Param('id') warehouseId: number,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<WarehouseDto> {
    this.logger.log(`Updating warehouse with id: ${warehouseId}`);
    try {
      return await this.updateWarehouseUseCase.updateWarehouse(
        warehouseId,
        updateWarehouseDto,
      );
    } catch (error) {
      this.logger.error(`Error updating warehouse: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Soft delete a warehouse by its id
   */
  @ApiOkResponse({ description: 'Warehouse soft deleted', type: WarehouseDto })
  @ApiBadRequestResponse({ description: 'Warehouse not found' })
  @ApiKeyAuth()
  @Delete('delete/:id')
  async softDeleteWarehouse(
    @Param('id') warehouseId: string,
  ): Promise<WarehouseDto> {
    this.logger.log(`Soft deleting warehouse with id: ${warehouseId}`);
    try {
      return await this.deleteWarehouseUseCase.deleteById(warehouseId);
    } catch (error) {
      this.logger.error(`Error soft deleting warehouse: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }
}
