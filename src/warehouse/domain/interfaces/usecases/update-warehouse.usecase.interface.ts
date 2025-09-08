import { UpdateWarehouseDto, WarehouseDto } from '../../dtos/warehouse.dtos';

/**
 * Interface for the update warehouse use case
 */
export interface IUpdateWarehouseUseCaseInterface {
  /**
   * Updates an existing warehouse
   *
   * @param warehouseId Unique identifier of the warehouse to update
   * @param updateWarehouseDto Data transfer object with updated warehouse information
   * @returns Promise with the updated warehouse data
   */
  updateWarehouse(
    warehouseId: number,
    updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<WarehouseDto>;
}
