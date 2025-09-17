import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './config/database/prisma.module';
import { EnvModule } from './config/env/env.module';
import { envSchema } from './config/env/schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: env => envSchema.parse(env),
    }),
    EnvModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
