import { lotStockUpdateSchema } from '../../domain/schemas/lot.schema';
import { chunkArray } from '../../../../utils/functions';
import { ILotRepositoryInterface } from '../../domain/interfaces/lot.repository.interface';
import { IUpdateStockUseCaseInterface } from '../../domain/interfaces/usecases/update-stock.usecase.interface';
import { LotDto, UpdateLotDto } from '../../domain/dtos/lot.dtos';
import { BadRequestException, Inject, Logger } from '@nestjs/common';
import {
  DEFAULT_STOCK_UPDATED_CHUNK_SIZE,
  SUCCESSFULLY_STOCK_UPDATED_MESSAGE,
} from '../constants';
import { UpdateLotStockResponseDto } from '../../domain/dtos/update-lot-stock-response.dto';

export class UpdateStockUseCase implements IUpdateStockUseCaseInterface {
  private readonly logger = new Logger(UpdateStockUseCase.name);

  constructor(
    @Inject('ILotRepositoryInterface')
    private readonly lotsRepository: ILotRepositoryInterface,
  ) {}

  async updateStockByProductAndWarehouse(
    updates: UpdateLotDto[],
  ): Promise<UpdateLotStockResponseDto> {
    if (!Array.isArray(updates) || !updates.length) {
      throw new BadRequestException(
        'The body must be an array with at least one element',
      );
    }

    this.logger.log(`Updating stock for ${updates.length} lots`);

    // Filtrar solo los objetos válidos según el schema Joi
    const validUpdates = updates.filter((item) => {
      const { error } = lotStockUpdateSchema.validate(item);
      if (error) {
        this.logger.warn(
          `Validation error for item ${JSON.stringify(item)}: ${error}`,
        );
      }
      return !error;
    });

    const results: LotDto[] = [];
    const batches = chunkArray(validUpdates, DEFAULT_STOCK_UPDATED_CHUNK_SIZE);

    for (const batch of batches) {
      const batchResult =
        await this.lotsRepository.updateStockByProductAndWarehouse(batch);
      results.push(...batchResult);
    }

    return {
      message: SUCCESSFULLY_STOCK_UPDATED_MESSAGE,
      total_stocks_updated: results.length,
      total_stocks_invalids: updates.length - validUpdates.length,
      total_stocks_received: updates.length,
      total_stocks_valid: validUpdates.length,
    };
  }
}
