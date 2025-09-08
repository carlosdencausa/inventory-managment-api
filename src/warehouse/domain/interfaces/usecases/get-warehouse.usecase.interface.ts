import { WarehouseDto } from '../../dtos/warehouse.dtos';

/**
 * Interface for the get warehouse use case
 */
export interface IGetWarehouseUseCaseInterface {
  /**
   * Retrieves a warehouse by its ID
   *
   * @param warehouseId Unique identifier of the warehouse to retrieve
   * @returns Promise with the warehouse data
   */
  getById(warehouseId: string): Promise<WarehouseDto>;
}
