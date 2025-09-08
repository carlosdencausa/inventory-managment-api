import { Injectable, Inject, Logger } from '@nestjs/common';
import { LotDto } from '../../domain/dtos/lot.dtos';
import { IGetLotUseCaseInterface } from '../../domain/interfaces/usecases/get-lot.usecase.interface';
import { ILotRepositoryInterface } from '../../../lot/domain/interfaces/lot.repository.interface';

@Injectable()
export class GetLotUseCase implements IGetLotUseCaseInterface {
  private readonly logger = new Logger(GetLotUseCase.name);

  constructor(
    @Inject('ILotRepositoryInterface')
    private readonly lotRepository: ILotRepositoryInterface,
  ) {}

  async getById(lotId: string): Promise<LotDto> {
    this.logger.log(`Fetching lot with id: ${lotId}`);
    return this.lotRepository.findById(lotId);
  }
}
