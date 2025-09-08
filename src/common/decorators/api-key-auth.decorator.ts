import { applyDecorators } from '@nestjs/common';
import { ApiSecurity, ApiUnauthorizedResponse } from '@nestjs/swagger';

/**
 * Decorator to document API key authentication requirement in Swagger
 */
export const ApiKeyAuth = () => {
  return applyDecorators(
    ApiSecurity('api_key'),
    ApiUnauthorizedResponse({
      description: 'Unauthorized. Valid API key is required.',
    }),
  );
};
