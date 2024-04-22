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
// import { SignUpModule } from './feature/auth/sign_up/sign_up.module';
// import { SignInModule } from './feature/auth/sign_in/sign_in.module';
// import { TokenModule } from './feature/auth/token/token.module';
// import { UsersModule } from './feature/user/users/users.module';
import { CacheModule } from './core/cache/modules/cache.module';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { LoggerModule } from './core/logger/modules/logger.module';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { SignUpController } from './feature/auth/sign-up/sign-up.controller';
import { AuthServiceSignUp } from './feature/auth/sign-up/sign-up.service';
import { AuthServiceSignIn } from './feature/auth/sign-in/sign-in.service';
import { SignInController } from './feature/auth/sign-in/sign-in.controller';
import { VerifyAccountController } from './feature/auth/verify-account/verify-account.controller';
import { AuthServiceVerifyAccount } from './feature/auth/verify-account/verify-account.service';
import { AccessTokenStrategy } from './common/strategies/token/accessToken.strategy';
import { RefreshTokenStrategy } from './common/strategies/token/refreshToken.strategy';
import {ExceptionsFilter} from './core/responses/filter/exception.filter';
// import {OtpModule} from "./feature/auth/otp/otp.module";

@Module({
    imports: [
        CacheModule,
        ConfigsModule,
        ContextModule,
        DatabaseModule,
        LoggerModule,
        ClientsModule,
        // CacheModule.registerAsync(RedisOptions)
    ],
    controllers: [AppController, SignUpController, SignInController, VerifyAccountController],
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

        {
            provide: 'GRPC_AUTH_SERVICE',
            useFactory: () => {
                return ClientProxyFactory.create({
                    transport: Transport.GRPC,
                    options: {
                        package: [
                            'main',
                            'signUp',
                            'signIn',
                            'verifyAccount',
                            'refreshToken',
                            'signOut',
                            'userToken',
                        ], // ['hero', 'hero2']
                        protoPath: join(__dirname, '../src/proto/main.proto'),
                        url: 'localhost:3001',
                        loader: {
                            enums: String,
                            objects: true,
                            arrays: true,
                        },
                    },
                });
            },
        },
        {
            provide: 'GRPC_AUTH_SERVICE_SIGN_UP',
            useClass: AuthServiceSignUp,
        },
        {
            provide: 'GRPC_AUTH_SERVICE_SIGN_IN',
            useClass: AuthServiceSignIn,
        },
        {
            provide: 'GRPC_AUTH_SERVICE_VERIFY_ACCOUNT',
            useClass: AuthServiceVerifyAccount,
        },
    ],
})
export class AppModule {}
