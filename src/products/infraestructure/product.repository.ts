import { promises as fs } from 'fs';
import * as path from 'path';
import { IProductRepositoryInterface } from '../../products/domain/interfaces/product.repository.interface';
import {
  CreateProductDto,
  ProductDto,
  UpdateProductDto,
} from '../../products/domain/dtos/products.dtos';
import { ProductEntity } from './entities/product.entity';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { INDEX_NOT_FOUND } from '../application/constants';
import { ProductErrors } from '../application/enums';

/**
 * Product Repository Implementation
 *
 * This class provides methods to interact with the product data storage.
 * It implements file-based persistence for products using JSON files.
 */
export class ProductRepository implements IProductRepositoryInterface {
  /**
   * Path to the JSON file storing product data
   */
  private readonly filePath = path.resolve(
    process.cwd(),
    'database/products.json',
  );

  /**
   * Reads all products from the file system
   *
   * @returns Promise containing an array of product entities
   */
  private async readProducts(): Promise<ProductEntity[]> {
    try {
      // Asegurarse de que el directorio database exista
      const dbDir = path.dirname(this.filePath);
      await fs.mkdir(dbDir, { recursive: true }).catch(() => {
        // Ignorar error si el directorio ya existe
      });

      // Intentar acceder al archivo
      try {
        await fs.access(this.filePath);
      } catch {
        // Si el archivo no existe, crear uno vacío
        await fs.writeFile(this.filePath, '[]', 'utf-8');
        return [];
      }
    } catch (error) {
      console.error('Error al preparar la ruta del archivo:', error);
      return [];
    }
    const data = await fs.readFile(this.filePath, 'utf-8');
    const plain = JSON.parse(data);
    return plain.map((productData: any) =>
      plainToClass(ProductEntity, productData),
    );
  }

  /**
   * Writes product list to the file system
   *
   * @param productList Array of product entities to persist
   * @returns Promise that resolves when writing is complete
   */
  private async writeProducts(productList: ProductEntity[]): Promise<void> {
    await fs.writeFile(
      this.filePath,
      JSON.stringify(productList, null, 2),
      'utf-8',
    );
  }

  /**
   * Creates a new product
   *
   * @param createProductDto Data transfer object containing product information
   * @returns Promise with the created product data
   * @throws Error if product with the same EAN already exists
   */
  async save(createProductDto: CreateProductDto): Promise<ProductDto> {
    const productList = await this.readProducts();
    if (
      productList.some(
        (existingProduct) => existingProduct.ean === createProductDto.ean,
      )
    ) {
      throw new Error(ProductErrors.EAN_MUST_BE_UNIQUE);
    }
    const newProductEntity = plainToClass(
      ProductEntity,
      instanceToPlain(createProductDto),
    );
    newProductEntity.id = productList.length
      ? Math.max(...productList.map((product) => product.id)) + 1
      : 1;
    productList.push(newProductEntity);
    await this.writeProducts(productList);
    return plainToClass(ProductDto, newProductEntity);
  }

  /**
   * Updates an existing product
   *
   * @param productId Identifier of the product to update
   * @param updateProductDto Data transfer object with updated product information
   * @returns Promise with the updated product data
   * @throws Error if product not found or EAN conflicts with existing product
   */
  async update(
    productId: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    const productList = await this.readProducts();
    const productIndex = productList.findIndex(
      (product) => String(product.id) === String(productId),
    );

    if (productIndex === INDEX_NOT_FOUND) {
      throw new Error(ProductErrors.PRODUCT_NOT_FOUND);
    }

    if (
      updateProductDto.ean &&
      productList.some(
        (existingProduct, idx) =>
          existingProduct.ean === updateProductDto.ean && idx !== productIndex,
      )
    ) {
      throw new Error(ProductErrors.EAN_MUST_BE_UNIQUE);
    }

    Object.assign(productList[productIndex], updateProductDto);
    productList[productIndex].updated_at = new Date();
    await this.writeProducts(productList);
    return plainToClass(ProductDto, productList[productIndex]);
  }

  /**
   * Retrieves a product by its ID
   *
   * @param productId Identifier of the product to retrieve
   * @returns Promise with the found product data
   * @throws Error if product not found or has been deleted
   */
  async findById(productId: string): Promise<ProductDto> {
    const productList = await this.readProducts();
    const product = productList.find(
      (productEntity) =>
        String(productEntity.id) === String(productId) &&
        !productEntity.deleted_at,
    );
    if (!product) {
      throw new Error(ProductErrors.PRODUCT_NOT_FOUND);
    }
    return plainToClass(ProductDto, product);
  }

  /**
   * Performs a soft delete on a product
   *
   * @param productId Identifier of the product to delete
   * @returns Promise with the deleted product data
   * @throws Error if product not found
   */
  async softDelete(productId: string): Promise<ProductDto> {
    const productList = await this.readProducts();
    const productIndex = productList.findIndex(
      (productEntity) => String(productEntity.id) === String(productId),
    );
    if (productIndex === INDEX_NOT_FOUND) {
      throw new Error(ProductErrors.PRODUCT_NOT_FOUND);
    }
    productList[productIndex].deleted_at = new Date();
    await this.writeProducts(productList);
    return plainToClass(ProductDto, productList[productIndex]);
  }
}
