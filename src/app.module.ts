import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shape } from './shapes/entities/shape.entity';  // Adjust path as needed
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ShapesModule } from './shapes/shapes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Make variables accessible globally
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT, 10),
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        entities: [Shape],
        synchronize: true, // Set this to false in production
      }),
    }),
    ShapesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

