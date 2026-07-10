import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import express from 'express';
import { AppModule } from './app.module';

const server = express();
let isAppInitialized = false;

const bootstrap = async () => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

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

  await app.init();
  isAppInitialized = true;
};

// Export Handler untuk Vercel Serverless Function
export default async (req: any, res: any) => {
  if (!isAppInitialized) {
    await bootstrap();
  }
  server(req, res);
};
