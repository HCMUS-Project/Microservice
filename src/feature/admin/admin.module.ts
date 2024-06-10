import { Module } from '@nestjs/common';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { AdminServiceTenant } from './tenant/tenant.service';
import {TenantController} from './tenant/tenant.controller';

@Module({
    imports: [ClientsModule],
    controllers: [],
    providers: [
        {
            provide: 'GRPC_ADMIN_SERVICE_TENANT',
            useClass: AdminServiceTenant,
        },
        {
            provide: 'GRPC_ADMIN_SERVICE',
            useFactory: (configService: ConfigService) => {
                return ClientProxyFactory.create({
                    transport: Transport.GRPC,
                    options: {
                        package: ['admin', 'tenant'], // ['hero', 'hero2']
                        protoPath: join(__dirname, '../../../src/proto/admin/admin.proto'),
                        url: configService.get<string>('ADMIN_SERVICE_URL'),
                        loader: {
                            enums: String,
                            objects: true,
                            arrays: true,
                            // includeDirs: [join(__dirname, '../../../src/proto/')],
                        },
                    },
                });
            },
            inject: [ConfigService],
        },
    ],
})
export class AdminModule {}