import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import express from 'express';
import { AppModule } from './app.module';

const server = express();
let isAppInitialized = false;

export const bootstrap = async () => {
  if (isAppInitialized) {
    return server;
  }

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  app.use(helmet());
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: (origin, callback) => {
      // Izinkan localhost dan semua subdomain vercel.app agar CORS tidak memblokir URL preview
      if (!origin || origin.startsWith('http://localhost') || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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
  return server;
};

// Default export untuk handler serverless Vercel
export default async (req: any, res: any) => {
  await bootstrap();
  server(req, res);
};
