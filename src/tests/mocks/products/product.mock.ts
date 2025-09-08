import {
  CreateProductDto,
  ProductDto,
  UpdateProductDto,
} from '../../../products/domain/dtos/products.dtos';

// Mock IDs
export const mockProductId = '1';
export const mockNumericProductId = 1;

// Mock para crear producto
export const mockCreateProductDto: CreateProductDto = {
  name: 'Leche Entera',
  ean: '7501001234567',
  description: 'Leche entera pasteurizada 1L',
  measurement_unit: 'L',
  quantity: 1,
};

// Mock para actualizar producto
export const mockUpdateProductDto: UpdateProductDto = {
  name: 'Leche Deslactosada',
  description: 'Leche deslactosada pasteurizada 1L',
  quantity: 2,
};

// Mock de producto completo
export const mockProductDto: ProductDto = {
  id: 1,
  name: 'Leche Entera',
  ean: '7501001234567',
  description: 'Leche entera pasteurizada 1L',
  measurement_unit: 'L',
  quantity: 1,
  created_at: new Date('2023-10-01T12:00:00Z'),
  updated_at: new Date('2023-10-01T12:00:00Z'),
  deleted_at: null,
};

// Mock de producto actualizado
export const mockUpdatedProductDto: ProductDto = {
  id: 1,
  name: 'Leche Deslactosada',
  ean: '7501001234567',
  description: 'Leche deslactosada pasteurizada 1L',
  measurement_unit: 'L',
  quantity: 2,
  created_at: new Date('2023-10-01T12:00:00Z'),
  updated_at: new Date('2023-10-02T12:00:00Z'),
  deleted_at: null,
};

// Mock de producto eliminado
export const mockDeletedProductDto: ProductDto = {
  id: 1,
  name: 'Leche Entera',
  ean: '7501001234567',
  description: 'Leche entera pasteurizada 1L',
  measurement_unit: 'L',
  quantity: 1,
  created_at: new Date('2023-10-01T12:00:00Z'),
  updated_at: new Date('2023-10-01T12:00:00Z'),
  deleted_at: new Date('2023-10-03T12:00:00Z'),
};

// Mock para errores
export const mockError = new Error('Error de prueba en productos');
