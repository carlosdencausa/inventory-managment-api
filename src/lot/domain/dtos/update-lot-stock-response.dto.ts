import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateLotStockResponseDto {
  @ApiProperty({ example: 'Stock updated successfully' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: 1, description: 'Total number of stocks updated' })
  @IsInt()
  @IsNotEmpty()
  total_stocks_updated: number;

  @ApiProperty({ example: 0, description: 'Total number of invalid stocks' })
  @IsInt()
  @IsNotEmpty()
  total_stocks_invalids: number;

  @ApiProperty({
    example: 3,
    description: 'Total number of stocks received in the request',
  })
  @IsInt()
  @IsNotEmpty()
  total_stocks_received: number;

  @ApiProperty({
    example: 2,
    description: 'Total number of valid stocks processed',
  })
  @IsInt()
  @IsNotEmpty()
  total_stocks_valid: number;
}
