import { Observable, firstValueFrom, lastValueFrom, take, toArray } from 'rxjs';
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ForbiddenException, UserNotFoundException } from 'src/common/exceptions/exceptions';
import {
    CreateTenantProfileRequestDTO,
    DeleteTenantProfileRequestDTO,
    FindTenantProfileByTenantIdRequestDTO,
    UpdateTenantProfileRequestDTO,
} from './tenantProfile.dto';
import { TenantProfileResponse } from 'src/proto_build/tenant/tenantProfile/TenantProfileResponse';

interface TenantProfileService {
    createTenantProfile(data: CreateTenantProfileRequestDTO): Observable<TenantProfileResponse>;
    findTenantProfileByTenantId(
        data: FindTenantProfileByTenantIdRequestDTO,
    ): Observable<TenantProfileResponse>;
    updateTenantProfile(data: UpdateTenantProfileRequestDTO): Observable<TenantProfileResponse>;
    deleteTenantProfile(data: DeleteTenantProfileRequestDTO): Observable<TenantProfileResponse>;
}

@Injectable()
export class TenantTenantProfileService implements OnModuleInit {
    private iTenantProfileService: TenantProfileService;

    constructor(@Inject('GRPC_TENANT_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iTenantProfileService =
            this.client.getService<TenantProfileService>('TenantProfileService');
    }

    async createTenantProfile(data: CreateTenantProfileRequestDTO): Promise<TenantProfileResponse> {
        try {
            // console.log(this.iTenantProfileService.createTenant(data));
            const tenantProfileResponse: TenantProfileResponse = await firstValueFrom(
                this.iTenantProfileService.createTenantProfile(data),
            );
            return tenantProfileResponse;
        } catch (e) {
            // console.log(e)
            let errorDetails: { error?: string };

            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError: any) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            } // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'TENANT_PROFILE_ALREADY_EXISTS') {
                throw new ForbiddenException('Tenant profile already exists', 'Forbidden');
            } else if (errorDetails.error == 'INVALID_TENANT_ID') {
                throw new ForbiddenException('Invalid tenant id', 'Forbidden');
            } else {
                throw new NotFoundException(e, 'Not found');
            }
        }
    }

    async findTenantProfileByTenantId(
        data: FindTenantProfileByTenantIdRequestDTO,
    ): Promise<TenantProfileResponse> {
        try {
            const tenantProfileResponse: TenantProfileResponse = await firstValueFrom(
                this.iTenantProfileService.findTenantProfileByTenantId(data),
            );
            return tenantProfileResponse;
        } catch (e) {
            // console.log(e);
            let errorDetails: { error?: string };

            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError: any) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            } // console.log(errorDetails);
            if (errorDetails.error == 'TENANT_PROFILE_NOT_FOUND') {
                throw new UserNotFoundException('Tenant profile not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async updateTenantProfile(data: UpdateTenantProfileRequestDTO): Promise<TenantProfileResponse> {
        try {
            const tenantProfileResponse: TenantProfileResponse = await firstValueFrom(
                this.iTenantProfileService.updateTenantProfile(data),
            );
            return tenantProfileResponse;
        } catch (e) {
            // console.log(e);
            let errorDetails: { error?: string };

            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError: any) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            } // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'TENANT_PROFILE_NOT_FOUND') {
                throw new UserNotFoundException('Tenant profile not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async deleteTenantProfile(data: DeleteTenantProfileRequestDTO): Promise<TenantProfileResponse> {
        try {
            const tenantProfileResponse: TenantProfileResponse = await firstValueFrom(
                this.iTenantProfileService.deleteTenantProfile(data),
            );
            return tenantProfileResponse;
        } catch (e) {
            // console.log(e);
            let errorDetails: { error?: string };

            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError: any) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            } // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'TENANT_PROFILE_NOT_FOUND') {
                throw new UserNotFoundException('Tenant profile not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }
}
