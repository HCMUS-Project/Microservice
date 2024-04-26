import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigsModule } from './configs/config.module';
import NestjsLoggerServiceAdapter from './core/logger/modules/logger.adapter';
import { ExceptionsFilter } from './core/responses/filter/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import rateLimit from '@fastify/rate-limit';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    // Implement NestFastify for application
    // const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    //     bufferLogs: true,
    // });

    // To config microservice
    const app = await NestFactory.create(AppModule);

    // Config rate-limit
    // app.(rateLimit, {
    //     max: 10,
    //     timeWindow: '10 second',
    // })

    // Set default prefix for all routes
    app.setGlobalPrefix('api');

    // Enable CORS
    app.enableCors();

    // Config the logger
    const customLogger = app.get(NestjsLoggerServiceAdapter);
    app.useLogger(customLogger);

    // Config the filter for the exceptions
    app.useGlobalFilters(new ExceptionsFilter());

    //Get the value from the environment variables
    const configService = app.get(ConfigService<ConfigsModule>);
    const port = configService.get<number>('port');

    const config = new DocumentBuilder()
        .setTitle('SAAS BOOKING API')
        .setDescription('## API description')
        .addSecurity('JWT-access-token', {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT Access Token',
            description: 'Enter JWT access token',
            in: 'header',
        })
        .addSecurity('JWT-refresh-token', {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT Refresh Token',
            description: 'Enter JWT refresh token',
            in: 'header',
        })
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        swaggerOptions: { persistAuthorization: true },
    });

    // Start the microservice
    await app.startAllMicroservices();

    // Config validation pipe
    app.useGlobalPipes(new ValidationPipe());

    // Listen on the port
    await app.listen(port, async () => {
        const url = await app.getUrl();
        customLogger.log(`Server running on ${url}`);
    });
}

bootstrap();
