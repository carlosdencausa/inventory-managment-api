import { CreateLotDto, LotDto, UpdateLotDto } from '../dtos/lot.dtos';

export interface ILotRepositoryInterface {
  save(createLotDto: CreateLotDto): Promise<LotDto>;
  update(lotId: number, updateLotDto: UpdateLotDto): Promise<LotDto>;
  findById(lotId: string): Promise<LotDto>;
  softDelete(lotId: string): Promise<LotDto>;
  updateStockByProductAndWarehouse(updates: UpdateLotDto[]): Promise<LotDto[]>;
}
