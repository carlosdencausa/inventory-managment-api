import { Injectable, Inject, Logger } from '@nestjs/common';
import { WarehouseDto } from '../../domain/dtos/warehouse.dtos';
import { IWarehouseRepositoryInterface } from '../../domain/interfaces/warehouse.repository.interface';
import { IDeleteWarehouseUseCaseInterface } from '../../domain/interfaces/usecases/delete-warehouse.usecase.interface';

/**
 * Use case for deleting warehouse information
 *
 * This class handles the business logic for soft deleting warehouses
 * while maintaining data integrity.
 */
@Injectable()
export class DeleteWarehouseUseCase
  implements IDeleteWarehouseUseCaseInterface
{
  private readonly logger = new Logger(DeleteWarehouseUseCase.name);

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
   * Deletes a warehouse by its ID
   *
   * @param warehouseId Unique identifier of the warehouse to delete
   * @returns Promise with the deleted warehouse data
   */
  async deleteById(warehouseId: string): Promise<WarehouseDto> {
    this.logger.log(`Deleting warehouse with id: ${warehouseId}`);
    return this.warehouseRepository.softDelete(warehouseId);
  }
}
