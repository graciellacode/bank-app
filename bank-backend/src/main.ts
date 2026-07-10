import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aktifkan Helmet SEBELUM middleware lain (urutan penting)
  app.use(helmet());

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.WEBAUTHN_ORIGIN || 'http://localhost:3500',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 4000);
  console.log(`Backend running on http://localhost:${process.env.PORT ?? 4000}/api`);
}
bootstrap();