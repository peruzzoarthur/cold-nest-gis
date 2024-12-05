import {
  Controller,
  Get,
  Post,
  Query,
  Body,
} from '@nestjs/common';
import { ShapesService } from './shapes.service';
import { UploadGeoJSONDto } from './dto/upload-geojson-dto';

@Controller('shapes')
export class ShapesController {
  constructor(private readonly shapesService: ShapesService) { }

@Post('upload')
  async uploadGeoJSON(@Body() uploadGeoJSONDto: UploadGeoJSONDto) {
    // Validate GeoJSON type (already checked by TypeScript)
    if (uploadGeoJSONDto.geoJSON.type !== 'FeatureCollection') {
      throw new Error('Invalid GeoJSON: Must be a FeatureCollection.');
    }

    await this.shapesService.processGeoJSON(uploadGeoJSONDto.geoJSON, uploadGeoJSONDto.crs);
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
