import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ServiceConfigType } from './config/config.type';
import validationOptions from './utils/validation-options';
import { join } from 'path';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const logger = new Logger('LinkBook services');
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });
  const configService = app.get(ConfigService<ServiceConfigType>);
  app.enableShutdownHooks();
  app.setGlobalPrefix(
      configService.getOrThrow('app.apiPrefix', { infer: true }),
      {
        exclude: ['/'],
      },
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'shared',
      protoPath: join(__dirname, './proto/shared.proto'),
      url: 'localhost:50051',
    },
  });
  await app.startAllMicroservices();
  await app.listen(
    configService.getOrThrow(
      'app.port',
      { infer: true },
    ),
      () => {
        logger.log(
            `LinkBook services Server is listening to port ${configService.getOrThrow(
                'app.port',
                { infer: true },
            )}...`,
        );
      },
  );
}
void bootstrap().catch((e) => {
  logger.error(`❌  Error starting server, ${e}`, '', 'Bootstrap');
  throw e;
});

