import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

// DTO for creating an API Key
export class CreateApiKeyDto {
  @ApiProperty({
    example: 'eb8a94c4-8b91-4124-8dbc-bd29f0c46335',
    description: 'The API key value',
  })
  @IsNotEmpty()
  @IsString()
  api_key: string;

  @ApiProperty({
    example: 'store-services-access-key',
    description: 'The API key description',
    required: true,
  })
  @IsString()
  description: string;
}

// Data Transfer Object for an API Key
export class ApiKeyDto extends CreateApiKeyDto {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the API key',
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

// DTO for updating an API Key
export class UpdateApiKeyDto {
  @ApiProperty({
    example: 65,
    description: 'Warehouse ID associated with this API key',
    required: false,
  })
  warehouse?: number;

  @ApiProperty({
    example: 'eb8a94c4-8b91-4124-8dbc-bd29f0c46335',
    description: 'The API key value',
    required: false,
  })
  api_key?: string;
}
