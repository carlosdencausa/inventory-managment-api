import {
  ApiKeyDto,
  CreateApiKeyDto,
  UpdateApiKeyDto,
} from '../../../api-key/domain/dtos/api-key.dtos';

// Mock API Key ID
export const mockApiKeyId = '1';
export const mockNumericApiKeyId = 1;

// Mock API Key
export const mockApiKeyDto: ApiKeyDto = {
  id: 1,
  api_key: 'eb8a94c4-8b91-4124-8dbc-bd29f0c46335',
  created_at: new Date('2025-07-05T09:00:00Z'),
  updated_at: null,
  deleted_at: null,
  description: '',
};

// Mock for created API Key
export const mockCreatedApiKeyDto: ApiKeyDto = {
  ...mockApiKeyDto,
};

// Mock for updated API Key
export const mockUpdatedApiKeyDto: ApiKeyDto = {
  ...mockApiKeyDto,
  api_key: 'fb8a94c4-8b91-4124-8dbc-bd29f0c46336',
  updated_at: new Date('2025-07-06T09:00:00Z'),
};

// Mock for deleted API Key
export const mockDeletedApiKeyDto: ApiKeyDto = {
  ...mockApiKeyDto,
  deleted_at: new Date('2025-07-07T09:00:00Z'),
};

// Mock Create API Key DTO
export const mockCreateApiKeyDto: CreateApiKeyDto = {
  api_key: 'eb8a94c4-8b91-4124-8dbc-bd29f0c46335',
  description: '',
};

// Mock Update API Key DTO
export const mockUpdateApiKeyDto: UpdateApiKeyDto = {
  warehouse: 66,
  api_key: 'fb8a94c4-8b91-4124-8dbc-bd29f0c46336',
};

// Mock Error
export const mockError = new Error('Test error message');

// Validation Errors
export const missingProperties: CreateApiKeyDto = {
  api_key: '',
  description: '',
};

export const missingPropertiesResponse = {
  statusCode: 400,
  message: ['warehouse must not be null'],
  error: 'Bad Request',
};

export const fullInvalidProperties: CreateApiKeyDto = {
  api_key: '',
  description: '',
};

export const fullInvalidPropertiesResponse = {
  statusCode: 400,
  message: ['warehouse must be a positive number'],
  error: 'Bad Request',
};
