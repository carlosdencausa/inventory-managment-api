import { WarehouseDto } from '../../dtos/warehouse.dtos';

/**
 * Interface for the delete warehouse use case
 */
export interface IDeleteWarehouseUseCaseInterface {
  /**
   * Deletes a warehouse by its ID
   *
   * @param warehouseId Unique identifier of the warehouse to delete
   * @returns Promise with the deleted warehouse data
   */
  deleteById(warehouseId: string): Promise<WarehouseDto>;
}
