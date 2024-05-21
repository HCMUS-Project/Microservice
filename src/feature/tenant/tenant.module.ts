import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { TenantTenantService } from './tenant/tenant.service';
import { TenantController } from './tenant/tenant.controller';
import {TenantTenantProfileService} from './tenantProfile/tenantProfile.service';
import {TenantProfileController} from './tenantProfile/tenantProfile.controller';
import {ThemeConfigController} from './themeConfig/themeConfig.controller';
import {TenantThemeConfigService} from './themeConfig/themeConfig.service';

@Module({
    imports: [ClientsModule],
    controllers: [TenantController, TenantProfileController, ThemeConfigController],
    providers: [
        {
            provide: 'GRPC_TENANT_SERVICE_TENANT',
            useClass: TenantTenantService,
        },
        {
            provide: 'GRPC_TENANT_SERVICE_PROFILE',
            useClass: TenantTenantProfileService,
        },
        {
            provide: 'GRPC_TENANT_SERVICE_THEME_CONFIG',
            useClass: TenantThemeConfigService,
        },
        {
            provide: 'GRPC_TENANT_SERVICE',
            useFactory: (configService: ConfigService) => {
                return ClientProxyFactory.create({
                    transport: Transport.GRPC,
                    options: {
                        package: [
                            'tenantService',
                            'userToken',
                            'banner',
                            'policyAndTerm',
                            'subscription',
                            'tenant',
                            'tenantProfile',
                            'themeConfig',
                        ],
                        protoPath: join(__dirname, '../../../src/proto/tenant/tenantService.proto'),
                        url: configService.get<string>('TENANT_SERVICE_URL'),
                        loader: {
                            enums: String,
                            objects: true,
                            arrays: true,
                        },
                    },
                });
            },
            inject: [ConfigService],
        },
    ],
})
export class TenantModule {}
