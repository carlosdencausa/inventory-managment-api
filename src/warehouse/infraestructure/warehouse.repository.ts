import { promises as fs } from 'fs';
import * as path from 'path';
import { IWarehouseRepositoryInterface } from '../../warehouse/domain/interfaces/warehouse.repository.interface';
import {
  WarehouseDto,
  CreateWarehouseDto,
  UpdateWarehouseDto,
} from '../../warehouse/domain/dtos/warehouse.dtos';
import { WarehouseEntity } from './entities/warehouse.entity';
import { plainToClass, instanceToPlain } from 'class-transformer';

export class WarehouseRepository implements IWarehouseRepositoryInterface {
  private readonly filePath = path.resolve(
    process.cwd(),
    'database/warehouses.json',
  );

  private async readWarehouses(): Promise<WarehouseEntity[]> {
    try {
      // Asegurarse de que el directorio database exista
      const dbDir = path.dirname(this.filePath);
      await fs.mkdir(dbDir, { recursive: true }).catch(() => {
        // Ignorar error si el directorio ya existe
      });

      // Intentar acceder al archivo
      try {
        await fs.access(this.filePath);
      } catch {
        // Si el archivo no existe, crear uno vacío
        await fs.writeFile(this.filePath, '[]', 'utf-8');
        return [];
      }
    } catch (error) {
      console.error('Error al preparar la ruta del archivo:', error);
      return [];
    }
    const data = await fs.readFile(this.filePath, 'utf-8');
    const plain = JSON.parse(data);
    return plain.map((warehouseData: any) =>
      plainToClass(WarehouseEntity, warehouseData),
    );
  }

  private async writeWarehouses(
    warehouseList: WarehouseEntity[],
  ): Promise<void> {
    await fs.writeFile(
      this.filePath,
      JSON.stringify(warehouseList, null, 2),
      'utf-8',
    );
  }

  async save(createWarehouseDto: CreateWarehouseDto): Promise<WarehouseDto> {
    const warehouseList = await this.readWarehouses();
    const newWarehouseEntity = plainToClass(
      WarehouseEntity,
      instanceToPlain(createWarehouseDto),
    );
    newWarehouseEntity.id = warehouseList.length
      ? Math.max(...warehouseList.map((warehouse) => warehouse.id)) + 1
      : 1;
    newWarehouseEntity.created_at = new Date();
    warehouseList.push(newWarehouseEntity);
    await this.writeWarehouses(warehouseList);
    return plainToClass(WarehouseDto, newWarehouseEntity);
  }

  async update(
    warehouseId: number,
    updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<WarehouseDto> {
    const warehouseList = await this.readWarehouses();
    const warehouseIndex = warehouseList.findIndex(
      (warehouse) => String(warehouse.id) === String(warehouseId),
    );
    if (warehouseIndex === -1) {
      throw new Error('WAREHOUSE_NOT_FOUND');
    }
    Object.assign(warehouseList[warehouseIndex], updateWarehouseDto);
    warehouseList[warehouseIndex].updated_at = new Date();
    await this.writeWarehouses(warehouseList);
    return plainToClass(WarehouseDto, warehouseList[warehouseIndex]);
  }

  async findById(warehouseId: string): Promise<WarehouseDto> {
    const warehouseList = await this.readWarehouses();
    const warehouse = warehouseList.find(
      (warehouseEntity) =>
        String(warehouseEntity.id) === String(warehouseId) &&
        !warehouseEntity.deleted_at,
    );
    if (!warehouse) {
      throw new Error('WAREHOUSE_NOT_FOUND');
    }
    return plainToClass(WarehouseDto, warehouse);
  }

  async softDelete(warehouseId: string): Promise<WarehouseDto> {
    const warehouseList = await this.readWarehouses();
    const warehouseIndex = warehouseList.findIndex(
      (warehouseEntity) => String(warehouseEntity.id) === String(warehouseId),
    );
    if (warehouseIndex === -1) {
      throw new Error('WAREHOUSE_NOT_FOUND');
    }
    warehouseList[warehouseIndex].deleted_at = new Date();
    await this.writeWarehouses(warehouseList);
    return plainToClass(WarehouseDto, warehouseList[warehouseIndex]);
  }
}
