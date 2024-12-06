import { Module } from '@nestjs/common';
import { ShapesService } from './shapes.service';
import { ShapesController } from './shapes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureCollectionEntity } from './entities/feature-collection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeatureCollectionEntity])],
  controllers: [ShapesController],
  providers: [ShapesService],
})
export class ShapesModule {}
