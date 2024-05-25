import { Observable, firstValueFrom, lastValueFrom, take, toArray } from 'rxjs';
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ForbiddenException, UserNotFoundException } from 'src/common/exceptions/exceptions';
import {VNPayConfigResponse} from 'src/proto_build/tenant/vnpayConfig/VNPayConfigResponse';
import {CreateVNPayConfigRequestDTO, DeleteVNPayConfigRequestDTO, GetVNPayConfigByTenantIdRequestDTO, UpdateVNPayConfigRequestDTO} from './vnpayConfig.dto';

interface VNPayConfigService {
    CreateVNPayConfig(data: CreateVNPayConfigRequestDTO): Observable<VNPayConfigResponse>;
    GetVNPayConfigByTenantId(
        data: GetVNPayConfigByTenantIdRequestDTO,
    ): Observable<VNPayConfigResponse>;
    UpdateVNPayConfig(data: UpdateVNPayConfigRequestDTO): Observable<VNPayConfigResponse>;
    DeleteVNPayConfig(data: DeleteVNPayConfigRequestDTO): Observable<VNPayConfigResponse>;
}

@Injectable()
export class TenantVNPayConfigService implements OnModuleInit {
    private iVNPayConfigService: VNPayConfigService;

    constructor(@Inject('GRPC_TENANT_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iVNPayConfigService =
            this.client.getService<VNPayConfigService>('VNPayConfigService');
    }

    async CreateVNPayConfig(data: CreateVNPayConfigRequestDTO): Promise<VNPayConfigResponse> {
        try {
            // console.log(this.iVNPayConfigService.createTenant(data));
            const vNPayConfigResponse: VNPayConfigResponse = await firstValueFrom(
                this.iVNPayConfigService.CreateVNPayConfig(data),
            );
            return vNPayConfigResponse;
        } catch (e) {
            // console.log(e)
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'VN_PAY_CONFIG_ALREADY_EXISTS') {
                throw new ForbiddenException('VNPay Config already exists', 'Forbidden');
            } else if (errorDetails.error == 'TENANT_ID_NOT_FOUND') {
                throw new UserNotFoundException('Tenant Id not found');
            } else {
                throw new NotFoundException(e, 'Not found');
            }
        }
    }

    async GetVNPayConfigByTenantId(
        data: GetVNPayConfigByTenantIdRequestDTO,
    ): Promise<VNPayConfigResponse> {
        try {
            const vNPayConfigResponse: VNPayConfigResponse = await firstValueFrom(
                this.iVNPayConfigService.GetVNPayConfigByTenantId(data),
            );
            return vNPayConfigResponse;
        } catch (e) {
            // console.log(e);
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);
            if (errorDetails.error == 'VN_PAY_CONFIG_NOT_FOUND') {
                throw new UserNotFoundException('VNPay config not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async UpdateVNPayConfig(data: UpdateVNPayConfigRequestDTO): Promise<VNPayConfigResponse> {
        try {
            // console.log(data)
            const vNPayConfigResponse: VNPayConfigResponse = await firstValueFrom(
                this.iVNPayConfigService.UpdateVNPayConfig(data),
            );
            return vNPayConfigResponse;
        } catch (e) {
            // console.log(e);
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'VN_PAY_CONFIG_NOT_FOUND') {
                throw new UserNotFoundException('VNPay config not found');
            } else if (errorDetails.error == 'TENANT_ID_NOT_FOUND') {
                throw new UserNotFoundException('Tenant Id not found');
            }else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async DeleteVNPayConfig(data: DeleteVNPayConfigRequestDTO): Promise<VNPayConfigResponse> {
        try {
            const vNPayConfigResponse: VNPayConfigResponse = await firstValueFrom(
                this.iVNPayConfigService.DeleteVNPayConfig(data),
            );
            return vNPayConfigResponse;
        } catch (e) {
            // console.log(e);
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'VN_PAY_CONFIG_NOT_FOUND') {
                throw new UserNotFoundException('VNPay config not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }
}
