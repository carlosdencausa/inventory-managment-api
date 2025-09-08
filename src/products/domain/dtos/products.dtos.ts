import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsDate } from 'class-validator';

/**
 * Data Transfer Object for creating a new product
 *
 * This DTO contains all the required information to create a new product
 * in the system. It is used for incoming product creation requests.
 */
export class CreateProductDto {
  @ApiProperty({ example: 'Leche Entera' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '7501001234567' })
  @IsString()
  @IsNotEmpty()
  ean: string;

  @ApiProperty({ example: 'Leche entera pasteurizada 1L' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'L' })
  @IsString()
  @IsNotEmpty()
  measurement_unit: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

/**
 * Data Transfer Object for product information
 *
 * This DTO extends CreateProductDto and adds system fields like ID and timestamps.
 * It is used for returning complete product information in responses.
 */
export class ProductDto extends CreateProductDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the product' })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Timestamp when the product was created',
  })
  @IsDate()
  created_at: Date;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Timestamp when the product was last updated',
  })
  @IsDate()
  updated_at: Date;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Timestamp when the product was soft-deleted (null if active)',
  })
  @IsDate()
  deleted_at: Date;
}

/**
 * Data Transfer Object for updating an existing product
 *
 * This DTO extends CreateProductDto as a partial type, allowing
 * clients to update only specific fields of a product without
 * having to provide all fields.
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
