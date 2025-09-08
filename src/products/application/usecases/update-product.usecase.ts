import { Inject, Injectable, Logger } from '@nestjs/common';
import { IProductRepositoryInterface } from '../../domain/interfaces/product.repository.interface';
import { UpdateProductDto, ProductDto } from '../../domain/dtos/products.dtos';
import { IUpdateProductUseCaseInterface } from '../../domain/interfaces/usecases/update-product.usecase.interface';

/**
 * Use case for updating product information
 *
 * This class handles the business logic for modifying existing product data
 * while ensuring data integrity and validation rules are followed.
 */
@Injectable()
export class UpdateProductUseCase implements IUpdateProductUseCaseInterface {
  private readonly logger = new Logger(UpdateProductUseCase.name);

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
   * Updates an existing product with new information
   *
   * @param id The unique identifier of the product to update
   * @param product The updated product data transfer object
   * @returns The updated product information
   */
  async updateProduct(
    id: number,
    product: UpdateProductDto,
  ): Promise<ProductDto> {
    this.logger.log(`Updating product with id: ${id}`);
    return this.productRepository.update(id, product);
  }
}
