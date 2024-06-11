import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    OnModuleInit,
} from '@nestjs/common';
import { Observable, firstValueFrom } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import {
    ForbiddenException,
    NotFoundException,
    UserNotFoundException,
} from 'src/common/exceptions/exceptions';
import { GetTenantRequestDTO, SetTenantStageRequestDTO, VerifyRequestDTO } from './tenant.dto';
import { GetTenantResponse } from 'src/proto_build/admin/tenant/GetTenantResponse';
import { VerifyResponse } from 'src/proto_build/admin/tenant/VerifyResponse';
import { SetTenantStageResponse } from 'src/proto_build/admin/tenant/SetTenantStageResponse';

interface TenantService {
    getTenant(data: GetTenantRequestDTO): Observable<GetTenantResponse>;
    verify(data: VerifyRequestDTO): Observable<VerifyResponse>;
    setTenantStage(data: SetTenantStageRequestDTO): Observable<SetTenantStageResponse>;
}

@Injectable()
export class AdminServiceTenant implements OnModuleInit {
    private iTenantService: TenantService;

    constructor(@Inject('GRPC_ADMIN_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iTenantService = this.client.getService<TenantService>('TenantService');
    }

    async getTenant(data: GetTenantRequestDTO): Promise<GetTenantResponse> {
        try {
            const response: GetTenantResponse = await firstValueFrom(
                this.iTenantService.getTenant(data),
            );
            return response;
        } catch (e) {
            // console.log(e)
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }

            throw new NotFoundException(
                `Unhandled error type: ${errorDetails.error}`,
                'Error not recognized',
            );
        }
    }

    async verify(data: VerifyRequestDTO): Promise<VerifyResponse> {
        try {
            const response: VerifyResponse = await firstValueFrom(this.iTenantService.verify(data));
            return response;
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
            if (errorDetails.error == 'TENANT_NOT_FOUND') {
                throw new ForbiddenException('Tenant not found');
            } else if (errorDetails.error == 'TENANT_NOT_ACTIVED') {
                throw new ForbiddenException('Tenant not activated');
            } else if (errorDetails.error == 'TENANT_NOT_VERIFIED') {
                throw new ForbiddenException('Tenant not verified');
            }
            else if (errorDetails.error == 'TENANT_ALREADY_VERIFIED') {
                throw new ForbiddenException('Tenant already verified');
            }
            {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async setTenantStage(data: SetTenantStageRequestDTO): Promise<SetTenantStageResponse> {
        try {
            const response: SetTenantStageResponse = await firstValueFrom(
                this.iTenantService.setTenantStage(data),
            );
            return response;
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
            if (errorDetails.error == 'TENANT_NOT_FOUND') {
                throw new ForbiddenException('Tenant not found');
            } else if (errorDetails.error == 'TENANT_NOT_UPDATED') {
                throw new ForbiddenException('Tenant not updated');
            }
            {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }
}
