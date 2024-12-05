import { Module } from '@nestjs/common';
import { ShapesService } from './shapes.service';
import { ShapesController } from './shapes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shape } from './entities/shape.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shape])],
  controllers: [ShapesController],
  providers: [ShapesService],
})
export class ShapesModule {}
