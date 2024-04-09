import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigsModule } from './configs/config.module';
import NestjsLoggerServiceAdapter from './core/logger/modules/logger.adapter';
import { ExceptionsFilter } from './core/responses/filter/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import rateLimit from '@fastify/rate-limit';
import {Transport} from '@nestjs/microservices';

async function bootstrap() {
    // Implement NestFastify for application
    // const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    //     bufferLogs: true,
    // });

    // To config microservice
    const app = await NestFactory.create(AppModule);

    // // Config rate-limit
    // app.register(rateLimit, {
    //     max: 10,
    //     timeWindow: '10 second',
    // })

    // Config the logger
    const customLogger = app.get(NestjsLoggerServiceAdapter);
    app.useLogger(customLogger);

    // Config the filter for the exceptions
    app.useGlobalFilters(new ExceptionsFilter());

    //Get the value from the environment variables
    const configService = app.get(ConfigService<ConfigsModule>);
    const port = configService.get<number>('port');

    const config = new DocumentBuilder()
        .setTitle('Your API')
        .setDescription('API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // Create microservice for gRPC communication
    app.connectMicroservice({
        transport: Transport.GRPC, // Use gRPC transport
        options: {
            // Define options for the gRPC microservice
            package: 'myservice', // Package name generated from your .proto file
            protoPath: 'src/feature/gateway/service/auth.proto', // Path to your .proto file
        },
    });

    // Start the microservice
    await app.startAllMicroservices();

    // Listen on the port
    await app.listen(port, async () => {
        const url = await app.getUrl();
        customLogger.log(`Server running on ${url}`);
    });
}

bootstrap();
