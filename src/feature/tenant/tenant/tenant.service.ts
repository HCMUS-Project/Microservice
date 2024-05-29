import { Observable, firstValueFrom, lastValueFrom, take, toArray } from 'rxjs';
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ForbiddenException, UserNotFoundException } from 'src/common/exceptions/exceptions';
import {
    CreateTenantRequestDTO,
    DeleteTenantRequestDTO,
    FindTenantByDomainRequestDTO,
    FindTenantByIdRequestDTO,
    UpdateTenantRequestDTO,
} from './tenant.dto';
import { TenantResponse } from 'src/proto_build/tenant/tenant/TenantResponse';

interface TenantService {
    createTenant(data: CreateTenantRequestDTO): Observable<TenantResponse>;
    findTenantByDomain(data: FindTenantByDomainRequestDTO): Observable<TenantResponse>;
    findTenantById(data: FindTenantByIdRequestDTO): Observable<TenantResponse>;
    updateTenant(data: UpdateTenantRequestDTO): Observable<TenantResponse>;
    deleteTenant(data: DeleteTenantRequestDTO): Observable<TenantResponse>;
}

@Injectable()
export class TenantTenantService implements OnModuleInit {
    private iTenantService: TenantService;

    constructor(@Inject('GRPC_TENANT_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iTenantService = this.client.getService<TenantService>('TenantService');
    }

    async createTenant(data: CreateTenantRequestDTO): Promise<TenantResponse> {
        try {
            // console.log(this.iTenantService.createTenant(data));
            const tenantResponse: TenantResponse = await firstValueFrom(
                this.iTenantService.createTenant(data),
            );
            return tenantResponse;
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
            } else if (errorDetails.error == 'TENANT_ALREADY_EXISTS') {
                throw new ForbiddenException('Tenant already exists', 'Forbidden');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async findTenantById(data: FindTenantByIdRequestDTO): Promise<TenantResponse> {
        try {
            const tenantResponse: TenantResponse = await firstValueFrom(
                this.iTenantService.findTenantById(data),
            );
            return tenantResponse;
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
            if (errorDetails.error == 'TENANT_NOT_FOUND') {
                throw new ForbiddenException('Tenant not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async findTenantByDomain(data: FindTenantByDomainRequestDTO): Promise<TenantResponse> {
        try {
            const tenantResponse: TenantResponse = await firstValueFrom(
                this.iTenantService.findTenantByDomain(data),
            );
            return tenantResponse;
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
            if (errorDetails.error == 'TENANT_NOT_FOUND') {
                throw new ForbiddenException('Tenant not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async updateTenant(data: UpdateTenantRequestDTO): Promise<TenantResponse> {
        try {
            const tenantResponse: TenantResponse = await firstValueFrom(
                this.iTenantService.updateTenant(data),
            );
            return tenantResponse;
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
            } else if (errorDetails.error == 'TENANT_NOT_FOUND') {
                throw new ForbiddenException('Tenant not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async deleteTenant(data: DeleteTenantRequestDTO): Promise<TenantResponse> {
        try {
            const tenantResponse: TenantResponse = await firstValueFrom(
                this.iTenantService.deleteTenant(data),
            );
            return tenantResponse;
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
            } else if (errorDetails.error == 'TENANT_NOT_FOUND') {
                throw new ForbiddenException('Tenant not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }
}
