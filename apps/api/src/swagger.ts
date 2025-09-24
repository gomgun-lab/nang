import { DocumentBuilder } from '@nestjs/swagger';

export const SWAGGER_OPTIONS = {
  PATH: 'api',
  TITLE: 'nang-api',
  DESCRIPTION: 'nang-api description',
};

export const swaggerDocumentOptions = new DocumentBuilder()
  .setTitle(SWAGGER_OPTIONS.TITLE)
  .setDescription(SWAGGER_OPTIONS.DESCRIPTION)
  .build();
