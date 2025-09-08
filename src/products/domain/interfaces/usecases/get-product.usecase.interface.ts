import { ProductDto } from '../../dtos/products.dtos';

export interface IGetProductUseCaseInterface {
  getById(id: string): Promise<ProductDto>;
}
