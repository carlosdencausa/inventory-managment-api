import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  CreateWarehouseDto,
  WarehouseDto,
} from '../../domain/dtos/warehouse.dtos';
import { IWarehouseRepositoryInterface } from '../../domain/interfaces/warehouse.repository.interface';
import { IAddWarehouseUseCaseInterface } from '../../domain/interfaces/usecases/add-warehouse.usecase.interface';

/**
 * Use case for adding new warehouses
 *
 * This class handles the business logic for creating warehouses
 * and validating input data.
 */
@Injectable()
export class AddWarehouseUseCase implements IAddWarehouseUseCaseInterface {
  private readonly logger = new Logger(AddWarehouseUseCase.name);

  /**
   * Constructor
   *
   * @param warehouseRepository Repository for warehouse data access
   */
  constructor(
    @Inject('IWarehouseRepositoryInterface')
    private readonly warehouseRepository: IWarehouseRepositoryInterface,
  ) {}

  /**
   * Creates a new warehouse
   *
   * @param createWarehouseDto Data transfer object with warehouse information
   * @returns Promise with the created warehouse data
   */
  async addWarehouse(
    createWarehouseDto: CreateWarehouseDto,
  ): Promise<WarehouseDto> {
    this.logger.log(`Adding warehouse: ${JSON.stringify(createWarehouseDto)}`);
    return this.warehouseRepository.save(createWarehouseDto);
  }
}
