import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shapes')
export class Shape {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'geometry', spatialFeatureType: 'Geometry', srid: 3857 })
  geometry: string;

  @Column('jsonb', { nullable: true })
  properties: Record<string, any>; // JSONB column for GeoJSON properties
}

