/**
 * Main module of the application
 * Sets the configuration module as a global module
 */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigsModule } from './configs/config.module';
import { ContextModule } from './configs/context/modules/contextStorage.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './core/responses/interceptors/response.interceptor';
import { DatabaseModule } from './core/database/modules/database.module';
import { CacheModule } from './core/cache/modules/cache.module';
import { LoggerModule } from './core/logger/modules/logger.module';
import { ClientsModule } from '@nestjs/microservices';
import { AccessTokenStrategy } from './common/strategies/token/accessToken.strategy';
import { RefreshTokenStrategy } from './common/strategies/token/refreshToken.strategy';
import { ExceptionsFilter } from './core/responses/filter/exception.filter';
import { AuthModule } from './feature/auth/auth.module';
import { EcommerceModule } from './feature/ecommerce/ecommerce.module';
import { BookingModule } from './feature/booking/booking.module';
import {TenantModule} from './feature/tenant/tenant.module';

@Module({
    imports: [
        CacheModule,
        ConfigsModule,
        ContextModule,
        DatabaseModule,
        LoggerModule,
        ClientsModule,
        AuthModule,
        EcommerceModule,
        BookingModule,
        TenantModule
        // CacheModule.registerAsync(RedisOptions)
    ],
    controllers: [AppController],
    providers: [
        AppService,
        AccessTokenStrategy,
        RefreshTokenStrategy,
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: ExceptionsFilter,
        },
    ],
})
export class AppModule {}
