import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { IProductUseCaseInterface } from '../../domain/interfaces/usecases/add-product.usecase.interface';
import { IUpdateProductUseCaseInterface } from '../../domain/interfaces/usecases/update-product.usecase.interface';
import { IGetProductUseCaseInterface } from '../../domain/interfaces/usecases/get-product.usecase.interface';
import { IDeleteProductUseCaseInterface } from '../../domain/interfaces/usecases/delete-product.usecase.interface';
import { BadRequestException } from '@nestjs/common';
import {
  mockProductId,
  mockNumericProductId,
  mockCreateProductDto,
  mockUpdateProductDto,
  mockProductDto,
  mockUpdatedProductDto,
  mockDeletedProductDto,
  mockError,
} from '../../../tests/mocks/products/product.mock';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productUseCase: IProductUseCaseInterface;
  let updateProductUseCase: IUpdateProductUseCaseInterface;
  let getProductUseCase: IGetProductUseCaseInterface;
  let deleteProductUseCase: IDeleteProductUseCaseInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: 'IProductUseCaseInterface',
          useValue: {
            addSingleProduct: jest.fn(),
          },
        },
        {
          provide: 'IUpdateProductUseCaseInterface',
          useValue: {
            updateProduct: jest.fn(),
          },
        },
        {
          provide: 'IGetProductUseCaseInterface',
          useValue: {
            getById: jest.fn(),
          },
        },
        {
          provide: 'IDeleteProductUseCaseInterface',
          useValue: {
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    productUseCase = module.get<IProductUseCaseInterface>(
      'IProductUseCaseInterface',
    );
    updateProductUseCase = module.get<IUpdateProductUseCaseInterface>(
      'IUpdateProductUseCaseInterface',
    );
    getProductUseCase = module.get<IGetProductUseCaseInterface>(
      'IGetProductUseCaseInterface',
    );
    deleteProductUseCase = module.get<IDeleteProductUseCaseInterface>(
      'IDeleteProductUseCaseInterface',
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Tests para getProduct
  describe('getProduct', () => {
    it('should return a product when found', async () => {
      jest
        .spyOn(getProductUseCase, 'getById')
        .mockResolvedValue(mockProductDto);

      const result = await controller.getProduct(mockProductId);

      expect(result).toEqual(mockProductDto);
      expect(getProductUseCase.getById).toHaveBeenCalledWith(mockProductId);
    });

    it('should throw BadRequestException when product not found', async () => {
      jest.spyOn(getProductUseCase, 'getById').mockRejectedValue(mockError);

      await expect(controller.getProduct(mockProductId)).rejects.toThrow(
        BadRequestException,
      );
      expect(getProductUseCase.getById).toHaveBeenCalledWith(mockProductId);
    });
  });

  // Tests para addProduct
  describe('addProduct', () => {
    it('should create a new product successfully', async () => {
      jest
        .spyOn(productUseCase, 'addSingleProduct')
        .mockResolvedValue(mockProductDto);

      const result = await controller.addProduct(mockCreateProductDto);

      expect(result).toEqual(mockProductDto);
      expect(productUseCase.addSingleProduct).toHaveBeenCalledWith(
        mockCreateProductDto,
      );
    });

    it('should throw BadRequestException when creation fails', async () => {
      jest
        .spyOn(productUseCase, 'addSingleProduct')
        .mockRejectedValue(mockError);

      await expect(controller.addProduct(mockCreateProductDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(productUseCase.addSingleProduct).toHaveBeenCalledWith(
        mockCreateProductDto,
      );
    });
  });

  // Tests para updateProduct
  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      jest
        .spyOn(updateProductUseCase, 'updateProduct')
        .mockResolvedValue(mockUpdatedProductDto);

      const result = await controller.updateProduct(
        mockNumericProductId,
        mockUpdateProductDto,
      );

      expect(result).toEqual(mockUpdatedProductDto);
      expect(updateProductUseCase.updateProduct).toHaveBeenCalledWith(
        mockNumericProductId,
        mockUpdateProductDto,
      );
    });

    it('should throw BadRequestException when update fails', async () => {
      jest
        .spyOn(updateProductUseCase, 'updateProduct')
        .mockRejectedValue(mockError);

      await expect(
        controller.updateProduct(mockNumericProductId, mockUpdateProductDto),
      ).rejects.toThrow(BadRequestException);
      expect(updateProductUseCase.updateProduct).toHaveBeenCalledWith(
        mockNumericProductId,
        mockUpdateProductDto,
      );
    });
  });

  // Tests para softDeleteProduct
  describe('softDeleteProduct', () => {
    it('should soft delete a product successfully', async () => {
      jest
        .spyOn(deleteProductUseCase, 'softDelete')
        .mockResolvedValue(mockDeletedProductDto);

      const result = await controller.softDeleteProduct(mockProductId);

      expect(result).toEqual(mockDeletedProductDto);
      expect(deleteProductUseCase.softDelete).toHaveBeenCalledWith(
        mockProductId,
      );
    });

    it('should throw BadRequestException when deletion fails', async () => {
      jest
        .spyOn(deleteProductUseCase, 'softDelete')
        .mockRejectedValue(mockError);

      await expect(controller.softDeleteProduct(mockProductId)).rejects.toThrow(
        BadRequestException,
      );
      expect(deleteProductUseCase.softDelete).toHaveBeenCalledWith(
        mockProductId,
      );
    });
  });
});
