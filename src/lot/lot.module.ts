import { Module } from '@nestjs/common';
import { UpdateStockUseCase } from './application/usecases/update-stock.usecase';
import { LotsController } from './infraestructure/controllers/lots.controller';
import { LotRepository } from './infraestructure/lot.repository';
import { GetLotUseCase } from './application/usecases/get-lot.usecase';
import { AddLotUseCase } from './application/usecases/add-lot.usecase';
import { DeleteLotUseCase } from './application/usecases/delete-lot.usecase';
import { UpdateLotUseCase } from './application/usecases/update-lot.usecase';
import { StockUpdateQueue } from './infraestructure/queue/stock-update.queue';

@Module({
  imports: [],
  controllers: [LotsController],
  providers: [
    {
      provide: 'ILotRepositoryInterface',
      useClass: LotRepository,
    },
    {
      provide: 'IUpdateStockUseCaseInterface',
      useClass: UpdateStockUseCase,
    },
    {
      provide: 'IGetLotUseCaseInterface',
      useClass: GetLotUseCase,
    },
    {
      provide: 'IAddLotUseCaseInterface',
      useClass: AddLotUseCase,
    },
    {
      provide: 'IDeleteLotUseCaseInterface',
      useClass: DeleteLotUseCase,
    },
    {
      provide: 'IUpdateLotUseCaseInterface',
      useClass: UpdateLotUseCase,
    },
    // Registrar el servicio de cola
    {
      provide: 'StockUpdateQueue',
      useFactory: (updateStockUseCase) => {
        return new StockUpdateQueue(updateStockUseCase);
      },
      inject: ['IUpdateStockUseCaseInterface'],
    },
  ],
  exports: [],
})
export class LotModule {}
