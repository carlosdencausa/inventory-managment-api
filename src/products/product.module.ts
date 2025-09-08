import { DeleteProductUseCase } from './application/usecases/delete-product.usecase';
import { Module } from '@nestjs/common';
import { AddProductsUseCase } from './application/usecases/add-products.usecase';
import { ProductsController } from './infraestructure/controllers/products.controller';
import { ProductRepository } from './infraestructure/product.repository';
import { UpdateProductUseCase } from './application/usecases/update-product.usecase';
import { GetProductUseCase } from './application/usecases/get-product.usecase';

/**
 * Product Module
 *
 * This module provides functionality for product management operations including:
 * - Creating new products
 * - Retrieving product information
 * - Updating existing products
 * - Deleting products (soft delete)
 */
@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [
    {
      provide: 'IProductRepositoryInterface',
      useClass: ProductRepository,
    },
    {
      provide: 'IProductUseCaseInterface',
      useClass: AddProductsUseCase,
    },
    {
      provide: 'IUpdateProductUseCaseInterface',
      useClass: UpdateProductUseCase,
    },
    {
      provide: 'IGetProductUseCaseInterface',
      useClass: GetProductUseCase,
    },
    {
      provide: 'IDeleteProductUseCaseInterface',
      useClass: DeleteProductUseCase,
    },
  ],
  exports: [],
})
export class ProductModule {}
