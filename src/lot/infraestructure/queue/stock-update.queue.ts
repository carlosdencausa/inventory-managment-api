import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { EventEmitter } from 'events';
import { UpdateLotDto } from '../../domain/dtos/lot.dtos';
import { UpdateLotStockResponseDto } from '../../domain/dtos/update-lot-stock-response.dto';
import { IUpdateStockUseCaseInterface } from '../../domain/interfaces/usecases/update-stock.usecase.interface';

/**
 * Queue service for handling stock updates sequentially
 * Implements OnModuleInit and OnModuleDestroy for controlled lifecycle
 */
@Injectable()
export class StockUpdateQueue implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(StockUpdateQueue.name);
  private readonly queue: Array<{
    updates: UpdateLotDto[];
    resolve: (value: UpdateLotStockResponseDto) => void;
    reject: (reason: any) => void;
  }> = [];
  private isProcessing = false;
  private readonly eventEmitter = new EventEmitter();
  private shouldProcess = true;
  private processor: Promise<void>;

  // Metrics for monitoring
  private totalProcessed = 0;
  private successCount = 0;
  private errorCount = 0;
  private lastProcessedAt: Date | null = null;

  constructor(
    private readonly updateStockUseCase: IUpdateStockUseCaseInterface,
  ) {
    // Configure a higher limit for listeners to avoid warnings
    this.eventEmitter.setMaxListeners(100);
  }

  /**
   * NestJS lifecycle method called when the module has been initialized
   */
  async onModuleInit() {
    this.logger.log('Initializing StockUpdateQueue processor');
    this.shouldProcess = true;
    // Start processing in a controlled manner
    this.processor = this.startProcessing();
  }

  /**
   * NestJS lifecycle method called when the application is shutting down
   */
  async onModuleDestroy() {
    this.logger.log('Shutting down StockUpdateQueue processor');
    this.shouldProcess = false;
    this.eventEmitter.emit('shutdown');

    // Wait for the processor to terminate correctly
    if (this.processor) {
      try {
        await this.processor;
        this.logger.log('StockUpdateQueue processor stopped gracefully');
      } catch (error) {
        this.logger.error(`Error stopping processor: ${error.message}`);
      }
    }
  }

  /**
   * Enqueues a stock update request and returns a promise
   * that will be resolved when the request is processed
   * Rejects the request if the service is shutting down
   */
  async enqueueUpdate(
    updates: UpdateLotDto[],
  ): Promise<UpdateLotStockResponseDto> {
    // Check if the service is active
    if (!this.shouldProcess) {
      throw new Error('Service is shutting down, not accepting new requests');
    }

    return new Promise<UpdateLotStockResponseDto>((resolve, reject) => {
      this.logger.log(`Enqueuing update for ${updates.length} lots`);

      // Add the request to the queue
      this.queue.push({ updates, resolve, reject });

      // Notify the processor that there's a new item in the queue
      this.eventEmitter.emit('new_item');
    });
  }

  /**
   * Starts processing the queue in the background
   * with a controlled loop that can be stopped gracefully
   */
  private async startProcessing(): Promise<void> {
    try {
      this.logger.log('Starting queue processor');

      // Controlled loop that can terminate when shouldProcess is false
      while (this.shouldProcess) {
        // If the queue is empty, wait for a new item or a shutdown request
        if (this.queue.length === 0) {
          await new Promise<void>((resolve) => {
            const onNewItem = () => {
              this.eventEmitter.removeListener('new_item', onNewItem);
              this.eventEmitter.removeListener('shutdown', onShutdown);
              resolve();
            };

            const onShutdown = () => {
              this.eventEmitter.removeListener('new_item', onNewItem);
              this.eventEmitter.removeListener('shutdown', onShutdown);
              resolve();
            };

            this.eventEmitter.once('new_item', onNewItem);
            this.eventEmitter.once('shutdown', onShutdown);
          });

          // If shutdown was requested while waiting, exit the loop
          if (!this.shouldProcess) {
            break;
          }
        }

        // Process the first item in the queue if there are items and we should continue processing
        if (this.queue.length > 0 && this.shouldProcess) {
          const { updates, resolve, reject } = this.queue.shift();

          try {
            this.isProcessing = true;
            this.logger.log(
              `Processing batch of ${updates.length} lot updates`,
            );

            // Execute the stock update
            const result =
              await this.updateStockUseCase.updateStockByProductAndWarehouse(
                updates,
              );

            // Resolve the promise with the result
            resolve(result);

            // Update metrics
            this.totalProcessed++;
            this.successCount++;
            this.lastProcessedAt = new Date();

            this.logger.log(
              `Successfully processed ${result.total_stocks_updated} lot updates`,
            );
          } catch (error) {
            this.logger.error(`Error processing batch: ${error.message}`);

            // Update error metrics
            this.totalProcessed++;
            this.errorCount++;
            this.lastProcessedAt = new Date();

            reject(error);
          } finally {
            this.isProcessing = false;
          }
        }

        // Small controlled pause to avoid consuming too many resources
        if (this.shouldProcess) {
          await new Promise((resolve) => {
            const timer = setTimeout(resolve, 10);
            // Clear the timeout if shutdown is requested while waiting
            this.eventEmitter.once('shutdown', () => clearTimeout(timer));
          });
        }
      }

      this.logger.log('Queue processor stopped');
    } catch (error) {
      this.logger.error(`Queue processor error: ${error.message}`);
      // Re-throw the error so it can be handled in onModuleInit
      throw error;
    } finally {
      // Reject any pending requests if the processor is stopped
      if (this.queue.length > 0) {
        this.logger.warn(
          `Rejecting ${this.queue.length} pending requests due to shutdown`,
        );
        for (const item of this.queue) {
          item.reject(new Error('Service is shutting down'));
        }
        this.queue.length = 0; // Empty the queue
      }
    }

    return; // Indicate that processing has finished
  }

  /**
   * Returns queue statistics for monitoring
   * Includes information about the processor state
   */
  getQueueStatus(): {
    queueSize: number;
    isProcessing: boolean;
    isActive: boolean;
    metrics: {
      pendingUpdatesCount: number; // Total pending update items
      totalProcessed: number;
      successCount: number;
      errorCount: number;
      lastProcessedAt: string | null;
    };
  } {
    // Calculate additional metrics
    const pendingUpdatesCount = this.queue.reduce(
      (total, item) => total + item.updates.length,
      0,
    );

    return {
      queueSize: this.queue.length,
      isProcessing: this.isProcessing,
      isActive: this.shouldProcess,
      metrics: {
        pendingUpdatesCount,
        totalProcessed: this.totalProcessed || 0,
        successCount: this.successCount || 0,
        errorCount: this.errorCount || 0,
        lastProcessedAt: this.lastProcessedAt
          ? this.lastProcessedAt.toISOString()
          : null,
      },
    };
  }
}
