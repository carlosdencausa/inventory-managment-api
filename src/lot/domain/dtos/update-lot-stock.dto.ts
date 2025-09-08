import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateLotStockDto {
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
