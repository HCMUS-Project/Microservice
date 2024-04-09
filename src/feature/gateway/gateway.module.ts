// import { Module } from '@nestjs/common';
// import { GatewayService } from './gateway.service';
// import { GatewayController } from './gateway.controller';
// import {ConfigService} from '@nestjs/config';
// import {HttpModule, HttpService} from '@nestjs/axios';

// @Module({
//   imports:[HttpModule],
//   controllers: [GatewayController],
//   providers: [GatewayService],
// })
// export class GatewayModule {}

import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { ClientsModule, Transport, ClientGrpc } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'AuthService',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        package: 'myservice',
                        protoPath: 'src/feature/gateway/service/auth.proto', // Provide the path to your auth.proto file
                        url: configService.get<string>('AUTH_SERVICE_URL'), // Assuming you have AUTH_SERVICE_URL in your config
                    },
                }),
            },
        ]),
    ],
    controllers: [GatewayController],
})
export class GatewayModule {}
