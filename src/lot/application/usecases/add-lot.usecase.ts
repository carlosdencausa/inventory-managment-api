import { Injectable, Inject, Logger } from '@nestjs/common';
import { LotDto, CreateLotDto } from '../../domain/dtos/lot.dtos';
import { ILotRepositoryInterface } from '../../domain/interfaces/lot.repository.interface';
import { IAddLotUseCaseInterface } from '../../domain/interfaces/usecases/add-lot.usecase.interface';

@Injectable()
export class AddLotUseCase implements IAddLotUseCaseInterface {
  private readonly logger = new Logger(AddLotUseCase.name);
  constructor(
    @Inject('ILotRepositoryInterface')
    private readonly lotRepository: ILotRepositoryInterface,
  ) {}

  async addLot(createLotDto: CreateLotDto): Promise<LotDto> {
    this.logger.log(`Adding lot: ${JSON.stringify(createLotDto)}`);
    return this.lotRepository.save(createLotDto);
  }
}
