import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { ArraySchema, ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  private readonly logger = new Logger(JoiValidationPipe.name);

  constructor(private schema: ObjectSchema | ArraySchema) {}

  async transform(value: any, _metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value, { stripUnknown: true });
    if (error) {
      this.logger.error(error.message);
      throw new BadRequestException(error.message);
    }
    return value;
  }
}
