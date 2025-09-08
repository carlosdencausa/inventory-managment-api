import { Injectable, Inject, Logger } from '@nestjs/common';
import { LotDto } from '../../domain/dtos/lot.dtos';
import { ILotRepositoryInterface } from '../../domain/interfaces/lot.repository.interface';
import { IDeleteLotUseCaseInterface } from '../../domain/interfaces/usecases/delete-lot.usecase.interface';

@Injectable()
export class DeleteLotUseCase implements IDeleteLotUseCaseInterface {
  private readonly logger = new Logger(DeleteLotUseCase.name);
  constructor(
    @Inject('ILotRepositoryInterface')
    private readonly lotRepository: ILotRepositoryInterface,
  ) {}

  async deleteById(lotId: string): Promise<LotDto> {
    this.logger.log(`Deleting lot with id: ${lotId}`);
    return this.lotRepository.softDelete(lotId);
  }
}
