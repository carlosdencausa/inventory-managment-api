import * as lockfile from 'proper-lockfile';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ILotRepositoryInterface } from '../domain/interfaces/lot.repository.interface';
import { LotDto, CreateLotDto, UpdateLotDto } from '../domain/dtos/lot.dtos';
import { plainToClass, instanceToPlain } from 'class-transformer';
import { LotEntity } from './entities/lot.entity';

export class LotRepository implements ILotRepositoryInterface {
  private readonly filePath = path.resolve(process.cwd(), 'database/lots.json');

  private async readLots(): Promise<any[]> {
    try {
      // Ensure the database directory exists
      const dbDir = path.dirname(this.filePath);
      await fs.mkdir(dbDir, { recursive: true }).catch(() => {
        // Ignore error if directory already exists
      });

      // Try to access the file
      try {
        await fs.access(this.filePath);
      } catch {
        // If the file does not exist, create an empty one
        await fs.writeFile(this.filePath, '[]', 'utf-8');
        return [];
      }
    } catch (error) {
      console.error('Error preparing the file path:', error);
      return [];
    }
    const data = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  private async writeLots(lotList: any[]): Promise<void> {
    await fs.writeFile(
      this.filePath,
      JSON.stringify(lotList, null, 2),
      'utf-8',
    );
  }

  async save(createLotDto: CreateLotDto): Promise<LotDto> {
    const lotList = await this.readLots();
    const newLot = { ...instanceToPlain(createLotDto) };
    newLot.id = lotList.length
      ? Math.max(...lotList.map((lot) => lot.id)) + 1
      : 1;
    newLot.created_at = new Date().toISOString();
    newLot.updated_at = null;
    newLot.deleted_at = null;
    lotList.push(newLot);
    await this.writeLots(lotList);
    return plainToClass(LotDto, newLot);
  }

  async update(lotId: number, updateLotDto: UpdateLotDto): Promise<LotDto> {
    const lotList = await this.readLots();
    const lotIndex = lotList.findIndex(
      (lot) => String(lot.id) === String(lotId),
    );
    if (lotIndex === -1) {
      throw new Error('LOT_NOT_FOUND');
    }
    Object.assign(lotList[lotIndex], updateLotDto);
    lotList[lotIndex].updated_at = new Date().toISOString();
    await this.writeLots(lotList);
    return plainToClass(LotDto, lotList[lotIndex]);
  }

  async findById(lotId: string): Promise<LotDto> {
    const lotList = await this.readLots();
    const lot = lotList.find(
      (lot) => String(lot.id) === String(lotId) && !lot.deleted_at,
    );
    if (!lot) {
      throw new Error('LOT_NOT_FOUND');
    }
    return plainToClass(LotDto, lot);
  }

  async softDelete(lotId: string): Promise<LotDto> {
    const lotList = await this.readLots();
    const lotIndex = lotList.findIndex(
      (lot) => String(lot.id) === String(lotId),
    );
    if (lotIndex === -1) {
      throw new Error('LOT_NOT_FOUND');
    }
    lotList[lotIndex].deleted_at = new Date().toISOString();
    await this.writeLots(lotList);
    return plainToClass(LotDto, lotList[lotIndex]);
  }

  /**
   * Updates the stock of multiple lots by product_id and warehouse_id
   * @param updates Array of objects with product_id, warehouse_id and stock
   * @returns Array of updated lots
   */
  async updateStockByProductAndWarehouse(
    updates: UpdateLotDto[],
  ): Promise<LotDto[]> {
    let release: (() => Promise<void>) | null = null;
    try {
      // Lock the file before reading/writing
      let fileExists = true;
      try {
        await fs.access(this.filePath);
      } catch {
        fileExists = false;
      }

      if (fileExists) {
        // Improved configuration for file locking
        const lockOptions = {
          stale: 10000, // Consider a lock stale after 10 seconds
          retries: {
            retries: 3, // Number of internal retries
            factor: 2, // Factor for exponential backoff
            minTimeout: 100, // Minimum time between retries (ms)
            maxTimeout: 1000, // Maximum time between retries (ms)
          },
        };

        // Use lock to handle acquisition in a more robust way
        try {
          release = await lockfile.lock(this.filePath, lockOptions);
        } catch (lockError) {
          throw new Error(
            `Lock file is already being held: ${lockError.message}`,
          );
        }
      }

      const lots = await this.readLots();
      // Create an index for O(1) access by product_id-warehouse_id
      const lotMap = new Map<string, LotEntity>();
      for (const lot of lots) {
        lotMap.set(`${lot.product_id}-${lot.warehouse_id}`, lot);
      }

      const updatedLots: LotEntity[] = [];
      for (const update of updates) {
        const key = `${update.product_id}-${update.warehouse_id}`;
        const lot = lotMap.get(key);
        if (lot) {
          lot.stock = update.stock;
          lot.updated_at = new Date();
          updatedLots.push(lot);
        }
      }

      // Save changes asynchronously for better performance
      await this.writeLots(Array.from(lotMap.values()));

      // Convert to DTOs
      return updatedLots.map((lot) =>
        plainToClass(LotDto, instanceToPlain(lot)),
      );
    } finally {
      // Release the lock if it exists
      if (release) {
        try {
          await release();
        } catch (releaseError) {
          console.error('Error releasing the lock:', releaseError);
        }
      }
    }
  }
}
