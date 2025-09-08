import {
  Body,
  Controller,
  Inject,
  Logger,
  Post,
  Param,
  BadRequestException,
  Put,
  Get,
  Delete,
} from '@nestjs/common';
import {
  CreateProductDto,
  ProductDto,
  UpdateProductDto,
} from '../../domain/dtos/products.dtos';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiKeyAuth } from '../../../common/decorators/api-key-auth.decorator';
import { IProductUseCaseInterface } from '../../domain/interfaces/usecases/add-product.usecase.interface';
import { IUpdateProductUseCaseInterface } from '../../domain/interfaces/usecases/update-product.usecase.interface';
import { IGetProductUseCaseInterface } from '../../domain/interfaces/usecases/get-product.usecase.interface';
import { IDeleteProductUseCaseInterface } from '../../domain/interfaces/usecases/delete-product.usecase.interface';

/**
 * Products API Controller
 *
 * This controller handles HTTP requests for product-related operations,
 * exposing endpoints for creating, reading, updating and soft-deleting products.
 */
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  /**
   * Constructor
   *
   * @param productUseCase Use case for adding products
   * @param updateProductUseCase Use case for updating products
   * @param getProductUseCase Use case for retrieving products
   * @param deleteProductUseCase Use case for deleting products
   */
  constructor(
    @Inject('IProductUseCaseInterface')
    private readonly productUseCase: IProductUseCaseInterface,
    @Inject('IUpdateProductUseCaseInterface')
    private readonly updateProductUseCase: IUpdateProductUseCaseInterface,
    @Inject('IGetProductUseCaseInterface')
    private readonly getProductUseCase: IGetProductUseCaseInterface,
    @Inject('IDeleteProductUseCaseInterface')
    private readonly deleteProductUseCase: IDeleteProductUseCaseInterface,
  ) {}

  /**
   * Retrieves a product by its ID
   *
   * @param id Unique identifier of the product to retrieve
   * @returns Promise containing the product data
   * @throws BadRequestException if product not found or other errors occur
   */
  @ApiOkResponse({
    status: 200,
    description: 'Get Product by id',
    type: ProductDto,
  })
  @ApiKeyAuth()
  @Get('get/:id')
  async getProduct(@Param('id') id: string): Promise<ProductDto> {
    this.logger.log(`Getting product with id: ${id}`);
    try {
      return await this.getProductUseCase.getById(id);
    } catch (error) {
      this.logger.error(`Error getting product: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Creates a new product
   *
   * @param product Data transfer object containing product information
   * @returns Promise containing the created product data
   * @throws BadRequestException if validation fails or other errors occur
   */
  @ApiOkResponse({
    status: 201,
    description: 'Create Product',
    type: ProductDto,
  })
  @ApiKeyAuth()
  @Post()
  async addProduct(@Body() product: CreateProductDto): Promise<ProductDto> {
    this.logger.log(`Creating a new product: ${JSON.stringify(product)}`);
    try {
      return await this.productUseCase.addSingleProduct(product);
    } catch (error) {
      this.logger.error(`Error creating product: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Updates an existing product
   *
   * @param id Unique identifier of the product to update
   * @param updateProductDto Data transfer object with updated product information
   * @returns Promise containing the updated product data
   * @throws BadRequestException if product not found or validation fails
   */
  @ApiOkResponse({
    status: 200,
    description: 'Update Product',
    type: ProductDto,
  })
  @ApiKeyAuth()
  @Put(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    this.logger.log(
      `Updating product with id: ${id}, data: ${JSON.stringify(updateProductDto)}`,
    );
    try {
      return await this.updateProductUseCase.updateProduct(
        id,
        updateProductDto,
      );
    } catch (error) {
      this.logger.error(`Error updating product: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Performs a soft delete on a product
   *
   * @param productId Unique identifier of the product to delete
   * @returns Promise containing the deleted product data
   * @throws BadRequestException if product not found or other errors occur
   */
  @ApiOkResponse({
    status: 200,
    description: 'Soft delete product by id',
    type: ProductDto,
  })
  @ApiKeyAuth()
  @Delete('delete/:id')
  async softDeleteProduct(@Param('id') productId: string): Promise<ProductDto> {
    this.logger.log(`Soft deleting product with id: ${productId}`);
    try {
      return await this.deleteProductUseCase.softDelete(productId);
    } catch (error) {
      this.logger.error(`Error soft deleting product: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }
}
