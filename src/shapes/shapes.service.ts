import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {  Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FeatureCollectionEntity } from './entities/feature-collection.entity';
import { Feature, FeatureCollection, Geometry } from 'geojson';

@Injectable()
export class ShapesService {
  constructor(
    @InjectRepository(FeatureCollectionEntity)
    private featureCollectionRepository: Repository<FeatureCollectionEntity>,
  ) {}

  private srid = parseInt(process.env.PROJECT_SRID);

  async findAll(): Promise<FeatureCollectionEntity[]> {
    return await this.featureCollectionRepository.find();
  }

  async delete(id: number): Promise<FeatureCollectionEntity> {
    const collection = await this.featureCollectionRepository.findOneBy({ id });

    if (!collection) {
      throw new HttpException(
        'FeatureCollection with the given ID not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.featureCollectionRepository.remove(collection);
  }

  async saveFeatureCollection(
    geoJSON: FeatureCollection,
    srid: number = this.srid,
  ): Promise<FeatureCollectionEntity> {

    // if (srid !== this.srid) {
    //   throw new HttpException(
    //     `SRID must be EPSG:${this.srid}`,
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    const featureCollectionEntity = this.featureCollectionRepository.create({
      geoJSON,
      srid,
    });

    return await this.featureCollectionRepository.save(featureCollectionEntity);
  }

  async findWithinBBox(bbox: string): Promise<GeoJSON.FeatureCollection[]> {
    const bboxCoords = bbox.split(',').map(Number);

    const results = await this.featureCollectionRepository.query(
      `
      SELECT id, geoJSON, srid 
      FROM feature_collections 
      WHERE ST_Intersects(
        ST_SetSRID(ST_GeomFromGeoJSON(geoJSON::text), srid), 
        ST_MakeEnvelope($1, $2, $3, $4, $5)
      )
      `,
      [...bboxCoords, this.srid],
    );

    // Map the results into GeoJSON FeatureCollections
    return results.map((result: any) => ({
      id: result.id,
      geoJSON: result.geoJSON,
    }));
  }

   async createBufferForGeoJSON(
    geoJSON: FeatureCollection,
    distance: number,
    srid: number,
  ): Promise<FeatureCollection> {
    const bufferedFeatures: Feature[] = [];

    // Loop through each feature in the FeatureCollection
    for (const feature of geoJSON.features) {
      const geometry: Geometry = feature.geometry;
      const properties = feature.properties || {};

      // Apply the ST_Buffer function to the geometry
      const bufferedGeometry = await this.createBuffer(geometry, distance, srid);

      // Create a new feature with the buffered geometry and the original properties
      const bufferedFeature: Feature = {
        type: 'Feature',
        geometry: bufferedGeometry,
        properties,
      };

      bufferedFeatures.push(bufferedFeature);
    }

    return {
      type: 'FeatureCollection',
      features: bufferedFeatures,
    };
  }
  private async createBuffer(geometry: Geometry, distance: number, srid: number): Promise<Geometry> {
    const result = await this.featureCollectionRepository.query(
      `
      SELECT ST_AsGeoJSON(ST_Buffer(ST_SetSRID(ST_GeomFromGeoJSON($1), $2), $3)) AS geometry
      `,
      [JSON.stringify(geometry), srid, distance],
    );

    if (result && result.length > 0) {
      return JSON.parse(result[0].geometry);
    }
    throw new Error('Buffer creation failed');
  }
}

