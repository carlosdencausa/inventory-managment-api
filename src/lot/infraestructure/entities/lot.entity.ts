import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class LotEntity {
  @IsNumber()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @IsNumber()
  @IsNotEmpty()
  warehouse_id: number;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;

  @IsDate()
  deleted_at: Date;

  constructor(partial?: Partial<LotEntity>) {
    Object.assign(this, partial);
    this.created_at = partial?.created_at ?? new Date();
    this.updated_at = partial?.updated_at ?? null;
    this.deleted_at = partial?.deleted_at ?? null;
  }
}
