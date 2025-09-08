import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  UpdateWarehouseDto,
  WarehouseDto,
} from '../../domain/dtos/warehouse.dtos';
import { IWarehouseRepositoryInterface } from '../../domain/interfaces/warehouse.repository.interface';
import { IUpdateWarehouseUseCaseInterface } from '../../domain/interfaces/usecases/update-warehouse.usecase.interface';

/**
 * Use case for updating warehouse information
 *
 * This class handles the business logic for modifying existing warehouse data
 * while ensuring data integrity.
 */
@Injectable()
export class UpdateWarehouseUseCase
  implements IUpdateWarehouseUseCaseInterface
{
  private readonly logger = new Logger(UpdateWarehouseUseCase.name);

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
   * Updates an existing warehouse
   *
   * @param warehouseId Unique identifier of the warehouse to update
   * @param updateWarehouseDto Data transfer object with updated warehouse information
   * @returns Promise with the updated warehouse data
   */
  async updateWarehouse(
    warehouseId: number,
    updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<WarehouseDto> {
    this.logger.log(`Updating warehouse with id: ${warehouseId}`);
    return this.warehouseRepository.update(warehouseId, updateWarehouseDto);
  }
}
