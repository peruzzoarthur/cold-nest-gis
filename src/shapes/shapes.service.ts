import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Shape } from './entities/shape.entity';
import { FeatureCollection, Geometry } from 'geojson';

@Injectable()
export class ShapesService {
  constructor(
    @InjectRepository(Shape)
    private shapesRepository: Repository<Shape>,
  ) { }

  async findAll(): Promise<Shape[]> {
    return await this.shapesRepository.find();
  }
  async processGeoJSON(geoJSON: FeatureCollection): Promise<void> {
    const features = geoJSON.features;

    for (const feature of features) {
      const geometry: Geometry = feature.geometry; // GeoJSON geometry
      const properties = feature.properties || {}; // Optional properties

      await this.shapesRepository.query(
        `
        INSERT INTO shapes (geometry, properties)
        VALUES (ST_GeomFromGeoJSON($1), $2::jsonb)
        `,
        [JSON.stringify(geometry), JSON.stringify(properties)],
      );
    }
  }

async findWithinBBox(bbox: string): Promise<GeoJSON.FeatureCollection> {
  const bboxCoords = bbox.split(',').map(Number);

  // Query to select shapes within the bounding box and convert geometry to GeoJSON
  const result = await this.shapesRepository.query(
    `SELECT 
        ST_AsGeoJSON(geometry) AS geometry, 
        properties 
      FROM shapes 
      WHERE ST_Within(geometry, ST_MakeEnvelope($1, $2, $3, $4, 4326))`,
    bboxCoords,
  );

  // Convert the result into a GeoJSON FeatureCollection
  const geoJSON: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: result.map((row: any) => ({
      type: "Feature",
      geometry: JSON.parse(row.geometry), // Convert the GeoJSON string to an object
      properties: row.properties,
    })),
  };

  return geoJSON;
}
 
}
