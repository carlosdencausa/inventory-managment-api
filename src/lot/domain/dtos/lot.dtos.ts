import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateLotDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  product_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  warehouse_id: number;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  stock: number;
}

export class LotDto extends CreateLotDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ example: '2023-10-01T12:00:00Z' })
  @IsDate()
  created_at: Date;

  @ApiProperty({ example: '2023-10-01T12:00:00Z' })
  @IsDate()
  updated_at: Date;

  @ApiProperty({ example: '2023-10-01T12:00:00Z' })
  @IsDate()
  deleted_at: Date;
}

export class UpdateLotDto extends CreateLotDto {}
