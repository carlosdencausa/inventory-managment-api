import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyController } from './api-key.controller';
import { IGetApiKeyUseCaseInterface } from '../../domain/interfaces/usecases/get-api-key.usecase.interface';
import { IDeleteApiKeyUseCaseInterface } from '../../domain/interfaces/usecases/delete-api-key.usecase.interface';
import { IAddApiKeyUseCaseInterface } from '../../domain/interfaces/usecases/add-api-key.usecase.interface';
import { IUpdateApiKeyUseCaseInterface } from '../../domain/interfaces/usecases/update-api-key.usecase.interface';
import { BadRequestException } from '@nestjs/common';
import {
  mockApiKeyId,
  mockNumericApiKeyId,
  mockCreateApiKeyDto,
  mockUpdateApiKeyDto,
  mockApiKeyDto,
  mockUpdatedApiKeyDto,
  mockDeletedApiKeyDto,
  mockError,
} from '../../../tests/mocks/api-key/api-key.mock';

describe('ApiKeyController', () => {
  let controller: ApiKeyController;
  let getApiKeyUseCase: IGetApiKeyUseCaseInterface;
  let deleteApiKeyUseCase: IDeleteApiKeyUseCaseInterface;
  let addApiKeyUseCase: IAddApiKeyUseCaseInterface;
  let updateApiKeyUseCase: IUpdateApiKeyUseCaseInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiKeyController],
      providers: [
        {
          provide: 'IGetApiKeyUseCaseInterface',
          useValue: {
            getById: jest.fn(),
          },
        },
        {
          provide: 'IDeleteApiKeyUseCaseInterface',
          useValue: {
            deleteById: jest.fn(),
          },
        },
        {
          provide: 'IAddApiKeyUseCaseInterface',
          useValue: {
            addApiKey: jest.fn(),
          },
        },
        {
          provide: 'IUpdateApiKeyUseCaseInterface',
          useValue: {
            updateApiKey: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ApiKeyController>(ApiKeyController);
    getApiKeyUseCase = module.get<IGetApiKeyUseCaseInterface>(
      'IGetApiKeyUseCaseInterface',
    );
    deleteApiKeyUseCase = module.get<IDeleteApiKeyUseCaseInterface>(
      'IDeleteApiKeyUseCaseInterface',
    );
    addApiKeyUseCase = module.get<IAddApiKeyUseCaseInterface>(
      'IAddApiKeyUseCaseInterface',
    );
    updateApiKeyUseCase = module.get<IUpdateApiKeyUseCaseInterface>(
      'IUpdateApiKeyUseCaseInterface',
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Tests for getApiKey
  describe('getApiKey', () => {
    it('should return an API key when found', async () => {
      jest.spyOn(getApiKeyUseCase, 'getById').mockResolvedValue(mockApiKeyDto);

      const result = await controller.getApiKey(mockApiKeyId);

      expect(result).toEqual(mockApiKeyDto);
      expect(getApiKeyUseCase.getById).toHaveBeenCalledWith(mockApiKeyId);
    });

    it('should throw BadRequestException when API key is not found', async () => {
      jest.spyOn(getApiKeyUseCase, 'getById').mockRejectedValue(mockError);

      await expect(controller.getApiKey(mockApiKeyId)).rejects.toThrow(
        BadRequestException,
      );
      expect(getApiKeyUseCase.getById).toHaveBeenCalledWith(mockApiKeyId);
    });
  });

  // Tests for addApiKey
  describe('addApiKey', () => {
    it('should create a new API key', async () => {
      jest
        .spyOn(addApiKeyUseCase, 'addApiKey')
        .mockResolvedValue(mockApiKeyDto);

      const result = await controller.addApiKey(mockCreateApiKeyDto);

      expect(result).toEqual(mockApiKeyDto);
      expect(addApiKeyUseCase.addApiKey).toHaveBeenCalledWith(
        mockCreateApiKeyDto,
      );
    });

    it('should throw BadRequestException when creation fails', async () => {
      jest.spyOn(addApiKeyUseCase, 'addApiKey').mockRejectedValue(mockError);

      await expect(controller.addApiKey(mockCreateApiKeyDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(addApiKeyUseCase.addApiKey).toHaveBeenCalledWith(
        mockCreateApiKeyDto,
      );
    });
  });

  // Tests for updateApiKey
  describe('updateApiKey', () => {
    it('should update an API key', async () => {
      jest
        .spyOn(updateApiKeyUseCase, 'updateApiKey')
        .mockResolvedValue(mockUpdatedApiKeyDto);

      const result = await controller.updateApiKey(
        mockNumericApiKeyId,
        mockUpdateApiKeyDto,
      );

      expect(result).toEqual(mockUpdatedApiKeyDto);
      expect(updateApiKeyUseCase.updateApiKey).toHaveBeenCalledWith(
        mockNumericApiKeyId,
        mockUpdateApiKeyDto,
      );
    });

    it('should throw BadRequestException when update fails', async () => {
      jest
        .spyOn(updateApiKeyUseCase, 'updateApiKey')
        .mockRejectedValue(mockError);

      await expect(
        controller.updateApiKey(mockNumericApiKeyId, mockUpdateApiKeyDto),
      ).rejects.toThrow(BadRequestException);
      expect(updateApiKeyUseCase.updateApiKey).toHaveBeenCalledWith(
        mockNumericApiKeyId,
        mockUpdateApiKeyDto,
      );
    });
  });

  // Tests for softDeleteApiKey
  describe('softDeleteApiKey', () => {
    it('should soft delete an API key', async () => {
      jest
        .spyOn(deleteApiKeyUseCase, 'deleteById')
        .mockResolvedValue(mockDeletedApiKeyDto);

      const result = await controller.softDeleteApiKey(mockApiKeyId);

      expect(result).toEqual(mockDeletedApiKeyDto);
      expect(deleteApiKeyUseCase.deleteById).toHaveBeenCalledWith(mockApiKeyId);
    });

    it('should throw BadRequestException when soft delete fails', async () => {
      jest
        .spyOn(deleteApiKeyUseCase, 'deleteById')
        .mockRejectedValue(mockError);

      await expect(controller.softDeleteApiKey(mockApiKeyId)).rejects.toThrow(
        BadRequestException,
      );
      expect(deleteApiKeyUseCase.deleteById).toHaveBeenCalledWith(mockApiKeyId);
    });
  });
});
