import { LotDto } from '../../dtos/lot.dtos';

export interface IGetLotUseCaseInterface {
  getById(lotId: string): Promise<LotDto>;
}
