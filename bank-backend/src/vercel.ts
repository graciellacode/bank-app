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

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
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

let bootstrapPromise: Promise<void> | null = null;

// Export Handler untuk Vercel Serverless Function
export default async (req: any, res: any) => {
  try {
    if (!isAppInitialized) {
      if (!bootstrapPromise) {
        bootstrapPromise = bootstrap();
      }
      await bootstrapPromise;
    }
    server(req, res);
  } catch (error: any) {
    console.error('Vercel serverless bootstrap failed:', error);
    bootstrapPromise = null; // reset promise so next request can retry
    res.status(500).json({
      statusCode: 500,
      message: 'Database/Server Initialization Failed. Check Vercel DB Environment Variables.',
      error: error?.message || String(error),
    });
  }
};
