import { Observable, firstValueFrom, lastValueFrom, take, toArray } from 'rxjs';
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ForbiddenException, UserNotFoundException } from 'src/common/exceptions/exceptions';
import {ThemeConfigResponse} from 'src/proto_build/tenant/themeConfig/ThemeConfigResponse';
import {CreateThemeConfigRequestDTO, DeleteThemeConfigRequestDTO, FindThemeConfigByTenantIdRequestDTO, UpdateThemeConfigRequestDTO} from './themeConfig.dto';

interface ThemeConfigService {
    createThemeConfig(data: CreateThemeConfigRequestDTO): Observable<ThemeConfigResponse>;
    findThemeConfigByTenantId(
        data: FindThemeConfigByTenantIdRequestDTO,
    ): Observable<ThemeConfigResponse>;
    updateThemeConfig(data: UpdateThemeConfigRequestDTO): Observable<ThemeConfigResponse>;
    deleteThemeConfig(data: DeleteThemeConfigRequestDTO): Observable<ThemeConfigResponse>;
}

@Injectable()
export class TenantThemeConfigService implements OnModuleInit {
    private iThemeConfigService: ThemeConfigService;

    constructor(@Inject('GRPC_TENANT_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iThemeConfigService =
            this.client.getService<ThemeConfigService>('ThemeConfigService');
    }

    async createThemeConfig(data: CreateThemeConfigRequestDTO): Promise<ThemeConfigResponse> {
        try {
            // console.log(this.iThemeConfigService.createTenant(data));
            const themeConfigResponse: ThemeConfigResponse = await firstValueFrom(
                this.iThemeConfigService.createThemeConfig(data),
            );
            return themeConfigResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'THEME_CONFIG_ALREADY_EXISTS') {
                throw new ForbiddenException('Theme config already exists', 'Forbidden');
            } else if (errorDetails.error == 'INVALID_TENANT_ID') {
                throw new ForbiddenException('Invalid tenant id', 'Forbidden');
            } else {
                throw new NotFoundException(e, 'Not found');
            }
        }
    }

    async findThemeConfigByTenantId(data: FindThemeConfigByTenantIdRequestDTO): Promise<ThemeConfigResponse> {
        try {
            const themeConfigResponse: ThemeConfigResponse = await firstValueFrom(
                this.iThemeConfigService.findThemeConfigByTenantId(data),
            );
            return themeConfigResponse;
        } catch (e) {
            // console.log(e);
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'THEME_CONFIG_NOT_FOUND') {
                throw new UserNotFoundException('Theme config not found');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async updateThemeConfig(data: UpdateThemeConfigRequestDTO): Promise<ThemeConfigResponse> {
        try {
            const themeConfigResponse: ThemeConfigResponse = await firstValueFrom(
                this.iThemeConfigService.updateThemeConfig(data),
            );
            return themeConfigResponse;
        } catch (e) {
            // console.log(e);
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'THEME_CONFIG_NOT_FOUND') {
                throw new UserNotFoundException('Theme config not found');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async deleteThemeConfig(data: DeleteThemeConfigRequestDTO): Promise<ThemeConfigResponse> {
        try {
            const themeConfigResponse: ThemeConfigResponse = await firstValueFrom(
                this.iThemeConfigService.deleteThemeConfig(data),
            );
            return themeConfigResponse;
        } catch (e) {
            // console.log(e);
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'THEME_CONFIG_NOT_FOUND') {
                throw new UserNotFoundException('Theme config not found');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }
}
