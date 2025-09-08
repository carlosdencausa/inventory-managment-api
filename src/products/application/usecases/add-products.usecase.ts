import { IProductRepositoryInterface } from '../../domain/interfaces/product.repository.interface';
import { CreateProductDto, ProductDto } from '../../domain/dtos/products.dtos';
import { Inject, Logger } from '@nestjs/common';
import { IProductUseCaseInterface } from '../../domain/interfaces/usecases/add-product.usecase.interface';

/**
 * Use Case for adding new products to the system
 *
 * This implementation handles the business logic for creating new products,
 * validating the input data, and persisting it through the repository.
 */
export class AddProductsUseCase implements IProductUseCaseInterface {
  private readonly logger = new Logger(AddProductsUseCase.name);

  /**
   * Constructor
   *
   * @param productRepositoryInterface Repository interface for product operations
   */
  constructor(
    @Inject('IProductRepositoryInterface')
    private readonly productRepositoryInterface: IProductRepositoryInterface,
  ) {}

  /**
   * Creates a new product in the system
   *
   * @param product The product data to create
   * @returns A promise that resolves to the created product with its ID and timestamps
   */
  async addSingleProduct(product: CreateProductDto): Promise<ProductDto> {
    this.logger.log(`Adding product: ${JSON.stringify(product.ean)}`);
    return this.productRepositoryInterface.save(product);
  }
}
