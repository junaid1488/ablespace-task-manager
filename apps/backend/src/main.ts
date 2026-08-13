import { NestFactory } from '@nestjs/core';
import {
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser = require('cookie-parser');
import compression = require('compression');

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const isDev = nodeEnv === 'development';

  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: isDev
      ? ['error', 'warn', 'log', 'debug']
      : ['error', 'warn'],
  });

  // Global API prefix
  app.setGlobalPrefix('api');

  // Compression
  app.use(compression());

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }),
  );

  // Cookies
  app.use(cookieParser());

  // CORS
  // Supports both local development and the deployed Render frontend.
  const corsOrigins = (
    process.env.CORS_ORIGIN ||
    'http://localhost:3000,https://ablespace-frontend-4or3.onrender.com'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: [
      'GET',
      'POST',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  });

  // URI versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception handling
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger
  if (isDev) {
    const config = new DocumentBuilder()
      .setTitle('AbleSpace Task Manager API')
      .setDescription(
        'REST API for the AbleSpace Task Management System',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(
      app,
      config,
    );

    SwaggerModule.setup('api/docs', app, document);

    logger.log('Swagger docs available at /api/docs');
  }

  // Server
  const port = process.env.PORT
    ? Number(process.env.PORT)
    : 4000;

  await app.listen(port, '0.0.0.0');

  logger.log(
    `API running on port ${port} at /api/v1`,
  );

  logger.log(`Environment: ${nodeEnv}`);
}

bootstrap().catch((error) => {
  console.error('Bootstrap failed:', error);
  process.exit(1);
});