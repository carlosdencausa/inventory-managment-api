import { Module } from '@nestjs/common';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { ProductModule } from '../products/product.module';
import { LotModule } from '../lot/lot.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { ApiKeyModule } from '../api-key/api-key.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    ProductModule,
    LotModule,
    WarehouseModule,
    ApiKeyModule,
    CommonModule,
  ],
})
export class AppModule {}
