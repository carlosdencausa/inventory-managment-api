import {
  Body,
  Controller,
  Logger,
  Inject,
  Post,
  Param,
  Put,
  BadRequestException,
  Get,
  Delete,
} from '@nestjs/common';
import { StockUpdateQueue } from '../queue/stock-update.queue';
import {
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ApiKeyAuth } from '../../../common/decorators/api-key-auth.decorator';
import { UpdateLotStockResponseDto } from '../../domain/dtos/update-lot-stock-response.dto';
import { LotDto, CreateLotDto, UpdateLotDto } from '../../domain/dtos/lot.dtos';
import { IUpdateStockUseCaseInterface } from '../../domain/interfaces/usecases/update-stock.usecase.interface';
import { IGetLotUseCaseInterface } from '../../domain/interfaces/usecases/get-lot.usecase.interface';
import { IDeleteLotUseCaseInterface } from '../../domain/interfaces/usecases/delete-lot.usecase.interface';
import { IAddLotUseCaseInterface } from '../../domain/interfaces/usecases/add-lot.usecase.interface';
import { IUpdateLotUseCaseInterface } from '../../domain/interfaces/usecases/update-lot.usecase.interface';

/**
 * Controller for managing lots.
 */

@ApiTags('Lots')
@Controller('lots')
export class LotsController {
  private readonly logger = new Logger(LotsController.name);

  constructor(
    @Inject('IUpdateStockUseCaseInterface')
    private readonly updateStockUseCase: IUpdateStockUseCaseInterface,
    @Inject('IGetLotUseCaseInterface')
    private readonly getLotUseCase: IGetLotUseCaseInterface,
    @Inject('IDeleteLotUseCaseInterface')
    private readonly deleteLotUseCase: IDeleteLotUseCaseInterface,
    @Inject('IAddLotUseCaseInterface')
    private readonly addLotUseCase: IAddLotUseCaseInterface,
    @Inject('IUpdateLotUseCaseInterface')
    private readonly updateLotUseCase: IUpdateLotUseCaseInterface,
    @Inject('StockUpdateQueue')
    private readonly stockUpdateQueue: StockUpdateQueue,
  ) {}
  /**
   * Get a lot by its id
   */
  @ApiOkResponse({ description: 'Lot found', type: LotDto })
  @ApiBadRequestResponse({ description: 'Lot not found' })
  @ApiKeyAuth()
  @Get('get/:id')
  async getLot(@Param('id') lotId: string): Promise<LotDto> {
    this.logger.log(`Getting lot with id: ${lotId}`);
    try {
      return await this.getLotUseCase.getById(lotId);
    } catch (error) {
      this.logger.error(`Error getting lot: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Create a new lot
   */
  @ApiCreatedResponse({ description: 'Lot created', type: LotDto })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiKeyAuth()
  @Post()
  async addLot(@Body() createLotDto: CreateLotDto): Promise<LotDto> {
    this.logger.log(`Creating a new lot: ${JSON.stringify(createLotDto)}`);
    try {
      return await this.addLotUseCase.addLot(createLotDto);
    } catch (error) {
      this.logger.error(`Error creating lot: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Update a lot by its id
   */
  @ApiOkResponse({ description: 'Lot updated', type: LotDto })
  @ApiBadRequestResponse({ description: 'Lot not found or invalid input' })
  @ApiKeyAuth()
  @Put(':id')
  async updateLot(
    @Param('id') lotId: number,
    @Body() updateLotDto: UpdateLotDto,
  ): Promise<LotDto> {
    this.logger.log(`Updating lot with id: ${lotId}`);
    try {
      return await this.updateLotUseCase.updateLot(lotId, updateLotDto);
    } catch (error) {
      this.logger.error(`Error updating lot: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Soft delete a lot by its id
   */
  @ApiOkResponse({ description: 'Lot soft deleted', type: LotDto })
  @ApiBadRequestResponse({ description: 'Lot not found' })
  @ApiKeyAuth()
  @Delete('delete/:id')
  async softDeleteLot(@Param('id') lotId: string): Promise<LotDto> {
    this.logger.log(`Soft deleting lot with id: ${lotId}`);
    try {
      return await this.deleteLotUseCase.deleteById(lotId);
    } catch (error) {
      this.logger.error(`Error soft deleting lot: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Update stock for multiple lots by product and warehouse
   * Utiliza una cola en memoria para procesar las actualizaciones de forma secuencial
   * y evitar problemas de concurrencia
   */
  @ApiResponse({
    description: 'Stock updated successfully',
    type: UpdateLotStockResponseDto,
  })
  @ApiKeyAuth()
  @Post('bulk-update-stock')
  @ApiBody({ type: UpdateLotDto, isArray: true })
  async updateStockByProductAndWarehouse(
    @Body()
    updates: UpdateLotDto[],
  ) {
    this.logger.log(`Received update request for ${updates.length} lots`);
    try {
      // En lugar de llamar directamente al caso de uso, encola la solicitud
      const result = await this.stockUpdateQueue.enqueueUpdate(updates);
      return result;
    } catch (error) {
      this.logger.error(`Error updating stock: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Endpoint adicional para obtener el estado de la cola
   * Útil para monitorización y diagnóstico
   */
  @ApiOkResponse({ description: 'Queue status' })
  @ApiKeyAuth()
  @Get('queue-status')
  getQueueStatus() {
    const status = this.stockUpdateQueue.getQueueStatus();
    return {
      queue_size: status.queueSize,
      is_processing: status.isProcessing,
      is_active: status.isActive,
      metrics: status.metrics,
      timestamp: new Date().toISOString(),
    };
  }
}
