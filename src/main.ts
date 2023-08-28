import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './auth/guards/auth.guard';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalGuards(new AuthGuard());
  app.use(cookieParser());

  app.enableCors({
    credentials: true,
    // origin: '*',

    origin: ['http://localhost:3000'],
    // origin: false,
    // Access-Control-Allow-Methods: "GET PUT POST DELETE HEAD OPTIONS PATCH",
    // methods: 'GET PUT POST DELETE HEAD OPTIONS PATCH',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    allowedHeaders: [
      'Origin',
      'Accept',
      'Content-Type',
      'Authorization',
      'Access-Control-Allow-Credentials',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
    ],
    exposedHeaders: '*',
    // allowedHeaders: '*',
    preflightContinue: false,
  });
  await app.listen(4200);
}
bootstrap();
