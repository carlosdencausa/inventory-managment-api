import {
  Injectable,
  NestMiddleware,
  ForbiddenException,
  Logger,
  Inject,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IValidateApiKeyUseCaseInterface } from '../../api-key/domain/interfaces/usecases/validate-api-key.usecase.interface';

/**
 * Middleware for validating API keys in the Authorization header
 */
@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ApiKeyMiddleware.name);

  constructor(
    @Inject('IValidateApiKeyUseCaseInterface')
    private readonly validateApiKeyUseCase: IValidateApiKeyUseCaseInterface,
  ) {}

  /**
   * Processes the HTTP request to validate the API key
   * @param req HTTP request object
   * @param res HTTP response object
   * @param next Function to continue to the next middleware
   */
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        this.logger.warn('No Authorization header provided');
        throw new ForbiddenException('API key not provided');
      }

      // Extract the token, assuming format "Bearer api-key-value" or simply "api-key-value"
      const apiKeyValue = this.extractApiKey(authHeader);

      if (!apiKeyValue) {
        this.logger.warn('Invalid API key format');
        throw new ForbiddenException('Invalid API key format');
      }

      // Validate the API key using the use case
      const validApiKey =
        await this.validateApiKeyUseCase.validateApiKey(apiKeyValue);

      if (!validApiKey) {
        this.logger.warn(`Invalid or revoked API key: ${apiKeyValue}`);
        throw new ForbiddenException('Invalid or revoked API key');
      }

      // Valid API key, continue
      next();
    } catch (error) {
      this.logger.error(`Authentication error: ${error.message}`);
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Invalid API key');
    }
  }

  /**
   * Extracts the API key from the Authorization header
   * @param authHeader Authorization header
   * @returns Extracted API key or null if the format is invalid
   */
  private extractApiKey(authHeader: string): string | null {
    // Allow both "Bearer api-key" and simply "api-key"
    const parts = authHeader.split(' ');

    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      return parts[1];
    } else if (parts.length === 1) {
      return parts[0];
    }

    return null;
  }
}
