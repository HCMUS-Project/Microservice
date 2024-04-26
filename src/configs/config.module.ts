/**
 * ConfigModule is a global module that imports the ConfigModule from the @nestjs/config package.
 */

import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ServiceConfig } from 'src/configs/service/service.config';

import appConfig from 'src/configs/app/app.config';
import mongoConfig from './database/mongo/mongo.config';
import cacheConfig from './cache/cache.config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
@Global()
@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 100,
            },
        ]),
        NestConfigModule.forRoot({
            envFilePath: ['.env'],
            isGlobal: true,
            load: [appConfig, mongoConfig, cacheConfig],
        }),
    ],
    controllers: [],
    providers: [
        ServiceConfig,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
    exports: [ServiceConfig],
})
export class ConfigsModule {}
