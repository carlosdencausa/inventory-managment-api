import { ProductDto } from '../../dtos/products.dtos';

export interface IDeleteProductUseCaseInterface {
  softDelete(productId: string): Promise<ProductDto>;
}
