import { Module } from '@nestjs/common';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { SignUpController } from './sign-up/sign-up.controller';
import { SignInController } from './sign-in/sign-in.controller';
import { VerifyAccountController } from './verify-account/verify-account.controller';
import { AuthServiceSignUp } from './sign-up/sign-up.service';
import { AuthServiceSignIn } from './sign-in/sign-in.service';
import { AuthServiceVerifyAccount } from './verify-account/verify-account.service';
import { join } from 'path';
import { SignOutController } from './sign-out/sign-out.controller';
import { AuthServiceSignOut } from './sign-out/sign-out.service';
import { AuthServiceRefreshToken } from './refresh-token/refresh-token.service';
import { RefreshTokenController } from './refresh-token/refresh-token.controller';

@Module({
    imports: [ClientsModule],
    controllers: [
        SignUpController,
        SignInController,
        VerifyAccountController,
        SignOutController,
        RefreshTokenController,
    ],
    providers: [
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
        {
            provide: 'GRPC_AUTH_SERVICE_SIGN_OUT',
            useClass: AuthServiceSignOut,
        },
        {
            provide: 'GRPC_AUTH_SERVICE_REFRESH_TOKEN',
            useClass: AuthServiceRefreshToken,
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
                        protoPath: join(__dirname, '../../../src/proto/main.proto'),
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
    ],
})
export class AuthModule {}
