import { Injectable, Inject, Logger } from '@nestjs/common';
import { WarehouseDto } from '../../domain/dtos/warehouse.dtos';
import { IWarehouseRepositoryInterface } from '../../domain/interfaces/warehouse.repository.interface';
import { IGetWarehouseUseCaseInterface } from '../../domain/interfaces/usecases/get-warehouse.usecase.interface';

/**
 * Use case for retrieving warehouse information
 *
 * This class handles the business logic for fetching warehouse data
 * from the repository.
 */
@Injectable()
export class GetWarehouseUseCase implements IGetWarehouseUseCaseInterface {
  private readonly logger = new Logger(GetWarehouseUseCase.name);

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
   * Retrieves a warehouse by its ID
   *
   * @param warehouseId Unique identifier of the warehouse to retrieve
   * @returns Promise with the warehouse data
   */
  async getById(warehouseId: string): Promise<WarehouseDto> {
    this.logger.log(`Fetching warehouse with id: ${warehouseId}`);
    return this.warehouseRepository.findById(warehouseId);
  }
}
