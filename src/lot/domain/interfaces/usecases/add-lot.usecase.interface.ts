import { LotDto, CreateLotDto } from '../../dtos/lot.dtos';

export interface IAddLotUseCaseInterface {
  addLot(createLotDto: CreateLotDto): Promise<LotDto>;
}
