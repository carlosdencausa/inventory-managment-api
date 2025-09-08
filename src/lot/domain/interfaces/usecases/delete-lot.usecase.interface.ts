import { LotDto } from '../../dtos/lot.dtos';

export interface IDeleteLotUseCaseInterface {
  deleteById(lotId: string): Promise<LotDto>;
}
