import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({}));
  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('포토폴리오 백엔드 ')
    .setDescription('간단한 백엔드를 구현했습니다.')
    .setVersion('1.0')
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // heroku H10 에러로 인한 선언
  const port: number = parseInt(`${process.env.PORT}`) || 3000;

  await app.listen(port);
}
bootstrap();
