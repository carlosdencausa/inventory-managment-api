import { Inject, Injectable, Logger } from '@nestjs/common';
import { ProductDto } from '../../domain/dtos/products.dtos';
import { IProductRepositoryInterface } from '../../domain/interfaces/product.repository.interface';
import { IDeleteProductUseCaseInterface } from '../../domain/interfaces/usecases/delete-product.usecase.interface';

/**
 * Use case for deleting product information
 *
 * This class implements the business logic for removing products
 * from the system while maintaining data integrity.
 */
@Injectable()
export class DeleteProductUseCase implements IDeleteProductUseCaseInterface {
  private readonly logger = new Logger(DeleteProductUseCase.name);

  /**
   * Constructor
   *
   * @param productRepository Repository for product data access
   */
  constructor(
    @Inject('IProductRepositoryInterface')
    private readonly productRepository: IProductRepositoryInterface,
  ) {}

  /**
   * Performs a soft delete operation on a product
   *
   * @param productId The unique identifier of the product to delete
   * @returns The deleted product data
   */
  async softDelete(productId: string): Promise<ProductDto> {
    this.logger.log(`Soft deleting product with id: ${productId}`);
    return this.productRepository.softDelete(productId);
  }
}
