import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseController } from './warehouse.controller';
import { IGetWarehouseUseCaseInterface } from 'src/warehouse/domain/interfaces/usecases/get-warehouse.usecase.interface';
import { IDeleteWarehouseUseCaseInterface } from 'src/warehouse/domain/interfaces/usecases/delete-warehouse.usecase.interface';
import { IAddWarehouseUseCaseInterface } from 'src/warehouse/domain/interfaces/usecases/add-warehouse.usecase.interface';
import { IUpdateWarehouseUseCaseInterface } from 'src/warehouse/domain/interfaces/usecases/update-warehouse.usecase.interface';
import {
  mockWarehouseDto,
  mockDeletedWarehouseDto,
  mockUpdatedWarehouseDto,
  mockCreateWarehouseDto,
  mockUpdateWarehouseDto,
  mockWarehouseId,
  mockNumericWarehouseId,
} from '../../../tests/mocks/warehouse/warehouse.mock';

describe('WarehouseController', () => {
  let controller: WarehouseController;
  let getWarehouseUseCase: IGetWarehouseUseCaseInterface;
  let deleteWarehouseUseCase: IDeleteWarehouseUseCaseInterface;
  let addWarehouseUseCase: IAddWarehouseUseCaseInterface;
  let updateWarehouseUseCase: IUpdateWarehouseUseCaseInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WarehouseController],
      providers: [
        {
          provide: 'IGetWarehouseUseCaseInterface',
          useValue: { getById: jest.fn() },
        },
        {
          provide: 'IDeleteWarehouseUseCaseInterface',
          useValue: { deleteById: jest.fn() },
        },
        {
          provide: 'IAddWarehouseUseCaseInterface',
          useValue: { addWarehouse: jest.fn() },
        },
        {
          provide: 'IUpdateWarehouseUseCaseInterface',
          useValue: { updateWarehouse: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<WarehouseController>(WarehouseController);
    getWarehouseUseCase = module.get<IGetWarehouseUseCaseInterface>(
      'IGetWarehouseUseCaseInterface',
    );
    deleteWarehouseUseCase = module.get<IDeleteWarehouseUseCaseInterface>(
      'IDeleteWarehouseUseCaseInterface',
    );
    addWarehouseUseCase = module.get<IAddWarehouseUseCaseInterface>(
      'IAddWarehouseUseCaseInterface',
    );
    updateWarehouseUseCase = module.get<IUpdateWarehouseUseCaseInterface>(
      'IUpdateWarehouseUseCaseInterface',
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get a warehouse by id', async () => {
    jest
      .spyOn(getWarehouseUseCase, 'getById')
      .mockResolvedValue(mockWarehouseDto);
    expect(await controller.getWarehouse(mockWarehouseId)).toEqual(
      mockWarehouseDto,
    );
  });

  it('should soft delete a warehouse', async () => {
    jest
      .spyOn(deleteWarehouseUseCase, 'deleteById')
      .mockResolvedValue(mockDeletedWarehouseDto);
    expect(await controller.softDeleteWarehouse(mockWarehouseId)).toEqual(
      mockDeletedWarehouseDto,
    );
  });

  it('should add a warehouse', async () => {
    jest
      .spyOn(addWarehouseUseCase, 'addWarehouse')
      .mockResolvedValue(mockWarehouseDto);
    expect(await controller.addWarehouse(mockCreateWarehouseDto)).toEqual(
      mockWarehouseDto,
    );
  });

  it('should update a warehouse', async () => {
    jest
      .spyOn(updateWarehouseUseCase, 'updateWarehouse')
      .mockResolvedValue(mockUpdatedWarehouseDto);
    expect(
      await controller.updateWarehouse(
        mockNumericWarehouseId,
        mockUpdateWarehouseDto,
      ),
    ).toEqual(mockUpdatedWarehouseDto);
  });
});
