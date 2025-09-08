import { Test, TestingModule } from '@nestjs/testing';
import { LotsController } from './lots.controller';
import { IGetLotUseCaseInterface } from '../../domain/interfaces/usecases/get-lot.usecase.interface';
import { IDeleteLotUseCaseInterface } from '../../domain/interfaces/usecases/delete-lot.usecase.interface';
import { IAddLotUseCaseInterface } from '../../domain/interfaces/usecases/add-lot.usecase.interface';
import { IUpdateLotUseCaseInterface } from '../../domain/interfaces/usecases/update-lot.usecase.interface';
import { BadRequestException } from '@nestjs/common';
import {
  mockLotId,
  mockNumericLotId,
  mockCreateLotDto,
  mockUpdateLotDto,
  mockLotDto,
  mockUpdatedLotDto,
  mockDeletedLotDto,
  mockError,
  missingProperties,
  missingPropertiesResponse,
  fullInvalidProperties,
  fullInvalidPropertiesResponse,
} from '../../../tests/mocks/lots/lots.mock';
import {
  mockQueueStatus,
  mockEmptyQueueStatus,
} from '../../../tests/mocks/lots/queue.mock';

describe('LotsController', () => {
  let controller: LotsController;
  let getLotUseCase: IGetLotUseCaseInterface;
  let deleteLotUseCase: IDeleteLotUseCaseInterface;
  let addLotUseCase: IAddLotUseCaseInterface;
  let updateLotUseCase: IUpdateLotUseCaseInterface;
  let stockUpdateQueue: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LotsController],
      providers: [
        {
          provide: 'IUpdateStockUseCaseInterface',
          useValue: {
            updateStockByProductAndWarehouse: jest.fn(),
          },
        },
        {
          provide: 'IGetLotUseCaseInterface',
          useValue: {
            getById: jest.fn(),
          },
        },
        {
          provide: 'IDeleteLotUseCaseInterface',
          useValue: {
            deleteById: jest.fn(),
          },
        },
        {
          provide: 'IAddLotUseCaseInterface',
          useValue: {
            addLot: jest.fn(),
          },
        },
        {
          provide: 'IUpdateLotUseCaseInterface',
          useValue: {
            updateLot: jest.fn(),
          },
        },
        {
          provide: 'StockUpdateQueue',
          useValue: {
            enqueueUpdate: jest.fn(),
            getQueueStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LotsController>(LotsController);
    getLotUseCase = module.get<IGetLotUseCaseInterface>(
      'IGetLotUseCaseInterface',
    );
    deleteLotUseCase = module.get<IDeleteLotUseCaseInterface>(
      'IDeleteLotUseCaseInterface',
    );
    addLotUseCase = module.get<IAddLotUseCaseInterface>(
      'IAddLotUseCaseInterface',
    );
    updateLotUseCase = module.get<IUpdateLotUseCaseInterface>(
      'IUpdateLotUseCaseInterface',
    );
    stockUpdateQueue = module.get('StockUpdateQueue');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Tests para getLot
  describe('getLot', () => {
    it('should return a lot when found', async () => {
      jest.spyOn(getLotUseCase, 'getById').mockResolvedValue(mockLotDto);

      const result = await controller.getLot(mockLotId);

      expect(result).toEqual(mockLotDto);
      expect(getLotUseCase.getById).toHaveBeenCalledWith(mockLotId);
    });

    it('should throw BadRequestException when lot not found', async () => {
      jest.spyOn(getLotUseCase, 'getById').mockRejectedValue(mockError);

      await expect(controller.getLot(mockLotId)).rejects.toThrow(
        BadRequestException,
      );
      expect(getLotUseCase.getById).toHaveBeenCalledWith(mockLotId);
    });
  });

  // Tests para addLot
  describe('addLot', () => {
    it('should create a new lot successfully', async () => {
      jest.spyOn(addLotUseCase, 'addLot').mockResolvedValue(mockLotDto);

      const result = await controller.addLot(mockCreateLotDto);

      expect(result).toEqual(mockLotDto);
      expect(addLotUseCase.addLot).toHaveBeenCalledWith(mockCreateLotDto);
    });

    it('should throw BadRequestException when creation fails', async () => {
      jest.spyOn(addLotUseCase, 'addLot').mockRejectedValue(mockError);

      await expect(controller.addLot(mockCreateLotDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(addLotUseCase.addLot).toHaveBeenCalledWith(mockCreateLotDto);
    });
  });

  // Tests para updateLot
  describe('updateLot', () => {
    it('should update a lot successfully', async () => {
      jest
        .spyOn(updateLotUseCase, 'updateLot')
        .mockResolvedValue(mockUpdatedLotDto);

      const result = await controller.updateLot(
        mockNumericLotId,
        mockUpdateLotDto,
      );

      expect(result).toEqual(mockUpdatedLotDto);
      expect(updateLotUseCase.updateLot).toHaveBeenCalledWith(
        mockNumericLotId,
        mockUpdateLotDto,
      );
    });

    it('should throw BadRequestException when update fails', async () => {
      jest.spyOn(updateLotUseCase, 'updateLot').mockRejectedValue(mockError);

      await expect(
        controller.updateLot(mockNumericLotId, mockUpdateLotDto),
      ).rejects.toThrow(BadRequestException);
      expect(updateLotUseCase.updateLot).toHaveBeenCalledWith(
        mockNumericLotId,
        mockUpdateLotDto,
      );
    });
  });

  // Tests para softDeleteLot
  describe('softDeleteLot', () => {
    it('should soft delete a lot successfully', async () => {
      jest
        .spyOn(deleteLotUseCase, 'deleteById')
        .mockResolvedValue(mockDeletedLotDto);

      const result = await controller.softDeleteLot(mockLotId);

      expect(result).toEqual(mockDeletedLotDto);
      expect(deleteLotUseCase.deleteById).toHaveBeenCalledWith(mockLotId);
    });

    it('should throw BadRequestException when deletion fails', async () => {
      jest.spyOn(deleteLotUseCase, 'deleteById').mockRejectedValue(mockError);

      await expect(controller.softDeleteLot(mockLotId)).rejects.toThrow(
        BadRequestException,
      );
      expect(deleteLotUseCase.deleteById).toHaveBeenCalledWith(mockLotId);
    });
  });

  // Tests for updateStockByProductAndWarehouse
  describe('updateStockByProductAndWarehouse', () => {
    it('should enqueue update request with missing properties', async () => {
      jest
        .spyOn(stockUpdateQueue, 'enqueueUpdate')
        .mockResolvedValue(missingPropertiesResponse);

      const result =
        await controller.updateStockByProductAndWarehouse(missingProperties);

      expect(result).toEqual(missingPropertiesResponse);
      expect(stockUpdateQueue.enqueueUpdate).toHaveBeenCalledWith(
        missingProperties,
      );
    });

    it('should handle invalid properties', async () => {
      jest
        .spyOn(stockUpdateQueue, 'enqueueUpdate')
        .mockResolvedValue(fullInvalidPropertiesResponse);

      const result = await controller.updateStockByProductAndWarehouse(
        fullInvalidProperties,
      );

      expect(result).toEqual(fullInvalidPropertiesResponse);
      expect(stockUpdateQueue.enqueueUpdate).toHaveBeenCalledWith(
        fullInvalidProperties,
      );
    });

    it('should throw BadRequestException when queue processing fails', async () => {
      jest
        .spyOn(stockUpdateQueue, 'enqueueUpdate')
        .mockRejectedValue(new Error('Queue processing error'));

      await expect(
        controller.updateStockByProductAndWarehouse(missingProperties),
      ).rejects.toThrow(BadRequestException);
      expect(stockUpdateQueue.enqueueUpdate).toHaveBeenCalledWith(
        missingProperties,
      );
    });
  });

  // Tests for getQueueStatus
  describe('getQueueStatus', () => {
    it('should return queue status with active processing', () => {
      jest
        .spyOn(stockUpdateQueue, 'getQueueStatus')
        .mockReturnValue(mockQueueStatus);

      const currentDate = new Date();
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => currentDate.getTime());
      jest
        .spyOn(Date.prototype, 'toISOString')
        .mockImplementation(() => '2025-09-07T10:30:00.000Z');

      const result = controller.getQueueStatus();

      expect(result).toEqual({
        queue_size: mockQueueStatus.queueSize,
        is_processing: mockQueueStatus.isProcessing,
        is_active: mockQueueStatus.isActive,
        metrics: mockQueueStatus.metrics,
        timestamp: expect.any(String),
      });

      expect(stockUpdateQueue.getQueueStatus).toHaveBeenCalled();

      // Restore original Date implementation
      Date.now = originalDateNow;
    });

    it('should return empty queue status', () => {
      jest
        .spyOn(stockUpdateQueue, 'getQueueStatus')
        .mockReturnValue(mockEmptyQueueStatus);

      const result = controller.getQueueStatus();

      expect(result).toEqual({
        queue_size: mockEmptyQueueStatus.queueSize,
        is_processing: mockEmptyQueueStatus.isProcessing,
        is_active: mockEmptyQueueStatus.isActive,
        metrics: mockEmptyQueueStatus.metrics,
        timestamp: expect.any(String),
      });

      expect(stockUpdateQueue.getQueueStatus).toHaveBeenCalled();
    });
  });
});
