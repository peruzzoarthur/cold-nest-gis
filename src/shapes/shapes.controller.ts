import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Delete,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ShapesService } from './shapes.service';
import { UploadGeoJSONDto } from './dto/upload-geojson-dto';
import { Geometry } from 'typeorm';

@Controller('shapes')
export class ShapesController {
  constructor(private readonly shapesService: ShapesService) {}

  @Post('upload')
  async uploadGeoJSON(@Body() uploadGeoJSONDto: UploadGeoJSONDto) {
    const { geoJSON, srid } = uploadGeoJSONDto;

    // Validate GeoJSON type
    if (geoJSON.type !== 'FeatureCollection') {
      throw new HttpException(
        'Invalid GeoJSON: Must be a FeatureCollection.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Save the entire FeatureCollection
    const result = await this.shapesService.saveFeatureCollection(geoJSON, srid);
    return {
      message: 'GeoJSON uploaded and processed successfully',
      id: result.id,
    };
  }

 @Post('buffer')
  async bufferGeoJSON(
    @Body() bufferDto: { geoJSON: GeoJSON.FeatureCollection; distance: number; srid: number },
  ) {
    const bufferedGeoJSON = await this.shapesService.createBufferForGeoJSON(
      bufferDto.geoJSON,
      bufferDto.distance,
      bufferDto.srid,
    );
    return  bufferedGeoJSON ;
  }

  @Get()
  async getAllFeatureCollections() {
    return await this.shapesService.findAll();
  }

  @Get('within-bbox')
  async findFeatureCollectionsWithinBBox(@Query('bbox') bbox: string) {
    if (!bbox) {
      throw new HttpException(
        'Bounding box (bbox) query parameter is required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.shapesService.findWithinBBox(bbox);
  }

  @Delete('/:id')
  async deleteFeatureCollection(@Param('id') id: string) {
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      throw new HttpException('Invalid ID: Must be a number.', HttpStatus.BAD_REQUEST);
    }

    const deleted = await this.shapesService.delete(idNumber);
    return {
      message: `FeatureCollection with ID ${id} deleted successfully.`,
      deleted,
    };
  }
}

