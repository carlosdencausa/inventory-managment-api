import { CreateWarehouseDto, WarehouseDto } from '../../dtos/warehouse.dtos';

/**
 * Interface for the add warehouse use case
 */
export interface IAddWarehouseUseCaseInterface {
  /**
   * Creates a new warehouse
   *
   * @param createWarehouseDto Data transfer object with warehouse information
   * @returns Promise with the created warehouse data
   */
  addWarehouse(createWarehouseDto: CreateWarehouseDto): Promise<WarehouseDto>;
}
