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

    const bodyParser = require('body-parser');

    // Increase the limit to 300KB
    app.use(bodyParser.json({ limit: '10mb' }));

    // Set default prefix for all routes
    app.setGlobalPrefix('api');

    // Enable CORS
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });

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
        .addSecurity('JWT-access-token-user', {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT Access Token User',
            description: 'Enter JWT access token for User',
            in: 'header',
        })
        .addSecurity('JWT-access-token-tenant', {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT Access Token Tenant',
            description: 'Enter JWT access token for Tenant',
            in: 'header',
        })
        .addSecurity('JWT-access-token-admin', {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT Access Token Admin',
            description: 'Enter JWT access token for Admin',
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
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
            whitelist: true, // Automatically remove non-whitelisted properties (those without any decorators in DTO)
            forbidNonWhitelisted: true, // Throw errors if non-whitelisted values are provided
            errorHttpStatusCode: 400, // Ensure HTTP 400 for validation errors
        }),
    );

    // Listen on the port
    await app.listen(port, async () => {
        const url = await app.getUrl();
        customLogger.log(`Server running on ${url}`);
    });
}

bootstrap();
