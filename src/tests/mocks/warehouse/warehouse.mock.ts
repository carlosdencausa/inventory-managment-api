import { WarehouseDto } from '../../../warehouse/domain/dtos/warehouse.dtos';

// Mock para un almacén normal
export const mockWarehouseDto: WarehouseDto = {
  id: 1,
  name: 'Test',
  location: 'Test',
  created_at: new Date(),
  updated_at: null,
  deleted_at: null,
};

// Mock para un almacén eliminado (soft delete)
export const mockDeletedWarehouseDto: WarehouseDto = {
  id: 1,
  name: 'Test',
  location: 'Test',
  created_at: new Date(),
  updated_at: null,
  deleted_at: new Date('2025-09-07T00:00:00Z'),
};

// Mock para un almacén actualizado
export const mockUpdatedWarehouseDto: WarehouseDto = {
  id: 1,
  name: 'Test',
  location: 'Test',
  created_at: new Date(),
  updated_at: new Date('2025-09-07T00:00:00Z'),
  deleted_at: null,
};

// Mock para datos de creación de un almacén
export const mockCreateWarehouseDto = {
  name: 'Test',
  location: 'Test',
};

// Mock para datos de actualización de un almacén
export const mockUpdateWarehouseDto = {
  name: 'Test',
  location: 'Test',
};

// Mock para ID de almacén
export const mockWarehouseId = '1';
export const mockNumericWarehouseId = 1;

// Mock para error
export const mockError = new Error('Something went wrong');
