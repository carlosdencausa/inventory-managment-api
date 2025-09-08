import { Injectable, Inject, Logger } from '@nestjs/common';
import { LotDto, UpdateLotDto } from '../../domain/dtos/lot.dtos';
import { ILotRepositoryInterface } from '../../domain/interfaces/lot.repository.interface';
import { IUpdateLotUseCaseInterface } from '../../domain/interfaces/usecases/update-lot.usecase.interface';

@Injectable()
export class UpdateLotUseCase implements IUpdateLotUseCaseInterface {
  private readonly logger = new Logger(UpdateLotUseCase.name);
  constructor(
    @Inject('ILotRepositoryInterface')
    private readonly lotRepository: ILotRepositoryInterface,
  ) {}

  async updateLot(lotId: number, updateLotDto: UpdateLotDto): Promise<LotDto> {
    this.logger.log(`Updating lot with id: ${lotId}`);
    return this.lotRepository.update(lotId, updateLotDto);
  }
}
