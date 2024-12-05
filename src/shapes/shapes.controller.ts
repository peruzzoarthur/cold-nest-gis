import {
  Controller,
  Get,
  Post,
  Query,
  Body,
} from '@nestjs/common';
import { ShapesService } from './shapes.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FeatureCollection } from 'geojson';

@Controller('shapes')
export class ShapesController {
  constructor(private readonly shapesService: ShapesService) { }

@Post('upload')
  async uploadGeoJSON(@Body() geoJSON: FeatureCollection) {
    // Validate GeoJSON type (already checked by TypeScript)
    if (geoJSON.type !== 'FeatureCollection') {
      throw new Error('Invalid GeoJSON: Must be a FeatureCollection.');
    }

    await this.shapesService.processGeoJSON(geoJSON);
    return { message: 'GeoJSON uploaded and processed successfully' };
  }
  @Get()
  async getAllShapes() {
    return await this.shapesService.findAll();
      
  }
  @Get('within-bbox')
  async findWithinBBox(@Query('bbox') bbox: string) {
    return await this.shapesService.findWithinBBox(bbox);
  }
}
