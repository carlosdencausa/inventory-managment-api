import { UpdateLotStockResponseDto } from '../../../lot/domain/dtos/update-lot-stock-response.dto';
import {
  LotDto,
  UpdateLotDto,
  CreateLotDto,
} from '../../../lot/domain/dtos/lot.dtos';

// Mocks para actualización de stock
export const missingProperties: UpdateLotDto[] = [
  { product_id: 1, warehouse_id: 1, stock: 10 },
  { product_id: 2, warehouse_id: 2, stock: 20 },
  { product_id: 3, warehouse_id: 3 } as any,
];

export const missingPropertiesResponse: UpdateLotStockResponseDto = {
  message: 'Stock updated successfully',
  total_stocks_updated: 2,
  total_stocks_received: 3,
  total_stocks_valid: 2,
  total_stocks_invalids: 1,
};

export const fullInvalidProperties: UpdateLotDto[] = [
  { product_id: 1 } as any,
  { warehouse_id: 2 } as any,
];

export const fullInvalidPropertiesResponse: UpdateLotStockResponseDto = {
  message: 'Stock updated successfully',
  total_stocks_updated: 0,
  total_stocks_received: 2,
  total_stocks_valid: 0,
  total_stocks_invalids: 2,
};

// Mocks para operaciones CRUD de lotes
export const mockLotId = '1';
export const mockNumericLotId = 1;

export const mockCreateLotDto: CreateLotDto = {
  product_id: 1,
  warehouse_id: 2,
  stock: 100,
};

export const mockUpdateLotDto: UpdateLotDto = {
  product_id: 1,
  warehouse_id: 2,
  stock: 150,
};

export const mockLotDto: LotDto = {
  id: 1,
  product_id: 1,
  warehouse_id: 2,
  stock: 100,
  created_at: new Date('2023-01-01'),
  updated_at: new Date('2023-01-02'),
  deleted_at: null,
};

export const mockUpdatedLotDto: LotDto = {
  id: 1,
  product_id: 1,
  warehouse_id: 2,
  stock: 150,
  created_at: new Date('2023-01-01'),
  updated_at: new Date('2023-01-03'),
  deleted_at: null,
};

export const mockDeletedLotDto: LotDto = {
  id: 1,
  product_id: 1,
  warehouse_id: 2,
  stock: 100,
  created_at: new Date('2023-01-01'),
  updated_at: new Date('2023-01-02'),
  deleted_at: new Date('2023-01-03'),
};

// Mock para errores
export const mockError = new Error('Test error message');
