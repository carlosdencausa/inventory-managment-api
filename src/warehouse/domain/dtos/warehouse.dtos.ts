import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';

// DTO for creating a warehouse
export class CreateWarehouseDto {
  @ApiProperty({
    example: 'Central Warehouse',
    description: 'Name of the warehouse',
  })
  name: string;

  @ApiProperty({ example: 'CDMX', description: 'Location of the warehouse' })
  location: string;
}

// Data Transfer Object for a warehouse
export class WarehouseDto extends CreateWarehouseDto {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the warehouse',
  })
  id: number;

  @ApiProperty({
    example: '2025-07-05T09:00:00Z',
    description: 'Creation date',
  })
  created_at: Date;

  @ApiProperty({ example: null, description: 'Last update date' })
  updated_at: Date | null;

  @ApiProperty({ example: null, description: 'Soft delete date' })
  deleted_at: Date | null;
}

// DTO for updating a warehouse
export class UpdateWarehouseDto extends PartialType(CreateWarehouseDto) {}
