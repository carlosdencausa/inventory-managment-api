import { UpdateProductDto, ProductDto } from '../../dtos/products.dtos';

export interface IUpdateProductUseCaseInterface {
  updateProduct(id: number, product: UpdateProductDto): Promise<ProductDto>;
}
