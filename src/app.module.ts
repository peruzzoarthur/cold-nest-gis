import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data-source'; // Import your DataSource
import { ShapesModule } from './shapes/shapes.module';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make .env variables globally available
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const dataSourceOptions = AppDataSource.options as PostgresConnectionOptions;
        return {
          type: dataSourceOptions.type,
          host: dataSourceOptions.host,
          port: dataSourceOptions.port,
          username: dataSourceOptions.username,
          password: dataSourceOptions.password,
          database: dataSourceOptions.database,
          entities: dataSourceOptions.entities,
          synchronize: true, // Disable synchronize to use migrations
        };
      },
    }),
    ShapesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

