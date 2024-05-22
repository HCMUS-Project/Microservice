import { Observable, firstValueFrom, lastValueFrom, take, toArray } from 'rxjs';
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ForbiddenException, UserNotFoundException } from 'src/common/exceptions/exceptions';
import { PolicyAndTermResponse } from 'src/proto_build/tenant/policyAndTerm/PolicyAndTermResponse';
import {
    CreatePolicyAndTermRequestDTO,
    DeletePolicyAndTermRequestDTO,
    FindPolicyAndTermByTenantIdRequestDTO,
    UpdatePolicyAndTermRequestDTO,
} from './policyAndTerm.dto';

interface PolicyAndTermService {
    createPolicyAndTerm(data: CreatePolicyAndTermRequestDTO): Observable<PolicyAndTermResponse>;
    findPolicyAndTermByTenantId(
        data: FindPolicyAndTermByTenantIdRequestDTO,
    ): Observable<PolicyAndTermResponse>;
    updatePolicyAndTerm(data: UpdatePolicyAndTermRequestDTO): Observable<PolicyAndTermResponse>;
    deletePolicyAndTerm(data: DeletePolicyAndTermRequestDTO): Observable<PolicyAndTermResponse>;
}

@Injectable()
export class TenantPolictyAndTermService implements OnModuleInit {
    private iPolicyAndTermService: PolicyAndTermService;

    constructor(@Inject('GRPC_TENANT_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iPolicyAndTermService =
            this.client.getService<PolicyAndTermService>('PolicyAndTermService');
    }

    async createPolicyAndTerm(data: CreatePolicyAndTermRequestDTO): Promise<PolicyAndTermResponse> {
        try {
            // console.log(this.iPolicyAndTermService.createTenant(data));
            const policyAndTermResponse: PolicyAndTermResponse = await firstValueFrom(
                this.iPolicyAndTermService.createPolicyAndTerm(data),
            );
            return policyAndTermResponse;
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
            } else if (errorDetails.error == 'POLICY_AND_TERM_ALREADY_EXISTS') {
                throw new ForbiddenException('Policy and term already exists', 'Forbidden');
            } else if (errorDetails.error == 'INVALID_TENANT_ID') {
                throw new ForbiddenException('Invalid tenant id', 'Forbidden');
            } else {
                throw new NotFoundException(e, 'Not found');
            }
        }
    }

    async findPolicyAndTermByTenantId(
        data: FindPolicyAndTermByTenantIdRequestDTO,
    ): Promise<PolicyAndTermResponse> {
        try {
            const policyAndTermResponse: PolicyAndTermResponse = await firstValueFrom(
                this.iPolicyAndTermService.findPolicyAndTermByTenantId(data),
            );
            return policyAndTermResponse;
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
            if (errorDetails.error == 'POLICY_AND_TERM_NOT_FOUND') {
                throw new UserNotFoundException('Policy and term not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async updatePolicyAndTerm(data: UpdatePolicyAndTermRequestDTO): Promise<PolicyAndTermResponse> {
        try {
            // console.log(data)
            const policyAndTermResponse: PolicyAndTermResponse = await firstValueFrom(
                this.iPolicyAndTermService.updatePolicyAndTerm(data),
            );
            return policyAndTermResponse;
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
            } else if (errorDetails.error == 'POLICY_AND_TERM_NOT_FOUND') {
                throw new UserNotFoundException('Policy and term not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async deletePolicyAndTerm(data: DeletePolicyAndTermRequestDTO): Promise<PolicyAndTermResponse> {
        try {
            const policyAndTermResponse: PolicyAndTermResponse = await firstValueFrom(
                this.iPolicyAndTermService.deletePolicyAndTerm(data),
            );
            return policyAndTermResponse;
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
            } else if (errorDetails.error == 'POLICY_AND_TERM_NOT_FOUND') {
                throw new UserNotFoundException('Policy and term not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }
}
