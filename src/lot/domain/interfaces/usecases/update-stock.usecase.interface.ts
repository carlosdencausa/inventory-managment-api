import { UpdateLotStockResponseDto } from '../../dtos/update-lot-stock-response.dto';
import { UpdateLotDto } from '../../dtos/lot.dtos';

export interface IUpdateStockUseCaseInterface {
  updateStockByProductAndWarehouse(
    updates: UpdateLotDto[],
  ): Promise<UpdateLotStockResponseDto>;
}
