import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './config/env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(EnvService);

  const apiPrefix = configService.get('API_PREFIX');
  const port = configService.get('PORT');

  app.setGlobalPrefix(apiPrefix);
  app.enableCors({ credentials: true });

  await app.listen(port);
}
bootstrap();
