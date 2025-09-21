import { cleanupOpenApiDoc } from 'nestjs-zod';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './config/env/env.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = app.get(EnvService);
  const apiPrefix = configService.get('API_PREFIX');
  const port = configService.get('PORT');

  app.setGlobalPrefix(apiPrefix);
  app.enableCors({ credentials: true });

  const openApiDoc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Nang API')
      .setDescription('Nang API description')
      .setVersion('1.0')
      .build()
  );
  SwaggerModule.setup(`${apiPrefix}/docs`, app, cleanupOpenApiDoc(openApiDoc));

  await app.listen(port);

  const baseUrl = `http://localhost:${port}`;
  const serverUrl = `${baseUrl}/${apiPrefix}`;
  const docsUrl = `${baseUrl}/${apiPrefix}/docs`;

  logger.log(`🚀 Server is running on: ${serverUrl}`);
  logger.log(`📚 API Documentation: ${docsUrl}`);
  logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

  // 개발 환경에서 추가 정보
  if (process.env.NODE_ENV !== 'production') {
    logger.log(`🔧 API Prefix: ${apiPrefix}`);
    logger.log(`📡 Port: ${port}`);
    logger.log(`📄 OpenAPI JSON: ${baseUrl}${apiPrefix}/docs-json`);
  }
}
bootstrap();
