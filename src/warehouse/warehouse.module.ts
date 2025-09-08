import { Module } from '@nestjs/common';
import { WarehouseController } from './infraestructure/controllers/warehouse.controller';
import { WarehouseRepository } from './infraestructure/warehouse.repository';
import { GetWarehouseUseCase } from './application/usecases/get-warehouse.usecase';
import { DeleteWarehouseUseCase } from './application/usecases/delete-warehouse.usecase';
import { AddWarehouseUseCase } from './application/usecases/add-warehouse.usecase';
import { UpdateWarehouseUseCase } from './application/usecases/update-warehouse.usecase';

@Module({
  imports: [],
  controllers: [WarehouseController],
  providers: [
    {
      provide: 'IWarehouseRepositoryInterface',
      useClass: WarehouseRepository,
    },
    {
      provide: 'IGetWarehouseUseCaseInterface',
      useClass: GetWarehouseUseCase,
    },
    {
      provide: 'IDeleteWarehouseUseCaseInterface',
      useClass: DeleteWarehouseUseCase,
    },
    {
      provide: 'IAddWarehouseUseCaseInterface',
      useClass: AddWarehouseUseCase,
    },
    {
      provide: 'IUpdateWarehouseUseCaseInterface',
      useClass: UpdateWarehouseUseCase,
    },
  ],
  exports: [],
})
export class WarehouseModule {}
