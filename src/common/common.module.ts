import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ApiKeyMiddleware } from './middleware/api-key.middleware';
import { ApiKeyModule } from '../api-key/api-key.module';

/**
 * Common module that provides shared functionalities for the application
 */
@Module({
  imports: [ApiKeyModule],
  providers: [ApiKeyMiddleware],
  exports: [ApiKeyMiddleware],
})
export class CommonModule {
  /**
   * Configure global or route-specific middleware
   */
  configure(consumer: MiddlewareConsumer) {
    // Apply the API key validation middleware to all routes except
    // the API keys management routes
    consumer
      .apply(ApiKeyMiddleware)
      .exclude(
        { path: 'api-keys/(.*)', method: RequestMethod.ALL },
        // Add here other public routes that don't require authentication
      )
      .forRoutes('*');
  }
}
