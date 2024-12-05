import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(process.env.POSTGRES_PORT)
  const config = new DocumentBuilder()
    .setTitle('GIS API')
    .setDescription('The cold-gis API description')
    .setVersion('1.0')
    .addTag('gis')
    .addTag('geo')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
