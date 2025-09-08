import { CreateProductDto, ProductDto } from '../../dtos/products.dtos';

export interface IProductUseCaseInterface {
  addSingleProduct(product: CreateProductDto): Promise<ProductDto>;
}
