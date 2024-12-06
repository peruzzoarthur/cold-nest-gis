import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('feature_collections')
export class FeatureCollectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  geoJSON: GeoJSON.FeatureCollection; 

  @Column({ type: 'int', nullable: false })
  srid: number; 
}

