import { WarehouseDto } from '../dtos/warehouse.dtos';

export interface IWarehouseRepositoryInterface {
  save(createWarehouseDto: any): Promise<WarehouseDto>;
  update(warehouseId: number, updateWarehouseDto: any): Promise<WarehouseDto>;
  findById(warehouseId: string): Promise<WarehouseDto>;
  softDelete(warehouseId: string): Promise<WarehouseDto>;
}
