import {
  CreateProductDto,
  ProductDto,
  UpdateProductDto,
} from '../dtos/products.dtos';

export interface IProductRepositoryInterface {
  save(product: CreateProductDto): Promise<ProductDto>;
  update(
    productId: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDto>;
  findById(productId: string): Promise<ProductDto>;
  softDelete(productId: string): Promise<ProductDto>;
}
