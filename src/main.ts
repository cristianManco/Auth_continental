import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { AllExceptionsFilter } from './Libs/common/filters/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = process.env.PORT || 3000;

  app.setGlobalPrefix('/api');
  app.enableCors();
  app.use(cors());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('authentication management API')
    .setDescription(
      'The authentication management API focuses primarily on authentication, providing a secure interface for user login, registration and user management, as well as sophisticated logging and global error handling..',
    )
    .setVersion('2.0')
    .addTag(
      'Authentication',
      'Operations related to user authentication and authorization',
    )
    .addBearerAuth() // Adds support for Bearer authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);

  console.log(`The application is running in: http://localhost:${port}/api\n`);
  console.log(
    `The Swagger app is running in: http://localhost:${port}/api/docs`,
  );
}

bootstrap();
