import { Inject, Injectable, Logger } from '@nestjs/common';
import { ProductDto } from '../../domain/dtos/products.dtos';
import { IProductRepositoryInterface } from '../../domain/interfaces/product.repository.interface';
import { IGetProductUseCaseInterface } from '../../domain/interfaces/usecases/get-product.usecase.interface';

/**
 * Use case for retrieving product information
 *
 * This class handles the business logic for retrieving product data
 * from the repository based on different search criteria.
 */
@Injectable()
export class GetProductUseCase implements IGetProductUseCaseInterface {
  private readonly logger = new Logger(GetProductUseCase.name);

  /**
   * Constructor
   *
   * @param productRepository Repository for product data access
   */
  constructor(
    @Inject('IProductRepositoryInterface')
    private readonly productRepository: IProductRepositoryInterface,
  ) {}

  async getById(id: string): Promise<ProductDto> {
    this.logger.log(`Fetching product with id: ${id}`);
    return this.productRepository.findById(id);
  }
}
