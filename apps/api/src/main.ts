import { SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './config/env/env.service';
import { SWAGGER_OPTIONS, swaggerDocumentOptions } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(EnvService);

  const apiPrefix = configService.get('API_PREFIX');
  const port = configService.get('PORT');

  app.setGlobalPrefix(apiPrefix);
  app.enableCors({ credentials: true });

  const document = SwaggerModule.createDocument(app, swaggerDocumentOptions);
  SwaggerModule.setup(SWAGGER_OPTIONS.PATH, app, document);

  await app.listen(port);
}
bootstrap();
