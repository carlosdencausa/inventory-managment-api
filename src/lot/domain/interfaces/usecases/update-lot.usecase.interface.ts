import { LotDto, UpdateLotDto } from '../../dtos/lot.dtos';

export interface IUpdateLotUseCaseInterface {
  updateLot(lotId: number, updateLotDto: UpdateLotDto): Promise<LotDto>;
}
