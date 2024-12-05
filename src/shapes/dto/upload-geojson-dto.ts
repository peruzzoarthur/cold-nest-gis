import { IsObject, IsOptional, IsNumber } from 'class-validator';
import { FeatureCollection } from 'geojson';

export class UploadGeoJSONDto {
  @IsObject()
  geoJSON: FeatureCollection;

  @IsOptional()
  @IsNumber()
  crs?: number; // CRS is optional
}
