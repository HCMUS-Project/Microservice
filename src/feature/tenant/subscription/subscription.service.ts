import { Observable, firstValueFrom, lastValueFrom, take, toArray } from 'rxjs';
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ForbiddenException, UserNotFoundException } from 'src/common/exceptions/exceptions';
import { SubscriptionResponse } from 'src/proto_build/tenant/subscription/SubscriptionResponse';
import {
    CancelSubscriptionRequestDTO,
    CreateSubscriptionRequestDTO,
    FindAllSubscriptionByQueryAdminRequestDTO,
    FindAllSubscriptionByQueryRequestDTO,
    FindPlansRequestDTO,
    UpdateSubscriptionStageByAdminRequestDTO,
} from './subscription.dto';
import { FindAllSubscriptionResponse } from 'src/proto_build/tenant/subscription/FindAllSubscriptionResponse';
import { FindPlansResponse } from 'src/proto_build/tenant/subscription/FindPlansResponse';

interface SubscriptionService {
    createSubscription(data: CreateSubscriptionRequestDTO): Observable<SubscriptionResponse>;
    findAllSubscriptionByQuery(
        data: FindAllSubscriptionByQueryRequestDTO,
    ): Observable<FindAllSubscriptionResponse>;
    findAllSubscriptionByQueryAdmin(
        data: FindAllSubscriptionByQueryAdminRequestDTO,
    ): Observable<FindAllSubscriptionResponse>;
    findPlans(data: FindPlansRequestDTO): Observable<FindPlansResponse>;
    updateSubscriptionStageByAdmin(
        data: UpdateSubscriptionStageByAdminRequestDTO,
    ): Observable<SubscriptionResponse>;
    cancelSubscription(data: CancelSubscriptionRequestDTO): Observable<SubscriptionResponse>;
}

@Injectable()
export class TenantSubscriptionService implements OnModuleInit {
    private iSubscriptionService: SubscriptionService;

    constructor(@Inject('GRPC_TENANT_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iSubscriptionService =
            this.client.getService<SubscriptionService>('SubscriptionService');
    }

    async createSubscription(data: CreateSubscriptionRequestDTO): Promise<SubscriptionResponse> {
        try {
            // console.log(this.iSubscriptionService.createTenant(data));
            const subscriptionResponse: SubscriptionResponse = await firstValueFrom(
                this.iSubscriptionService.createSubscription(data),
            );
            return subscriptionResponse;
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
            } else if (errorDetails.error == 'EXISTING_SUBSCRIPTION_NOT_CANCELLED') {
                throw new ForbiddenException('Existing subscription not cancelled', 'Forbidden');
            } else if (errorDetails.error == 'PLAN_NOT_FOUND') {
                throw new ForbiddenException('Plan not found', 'Forbidden');
            } else if (errorDetails.error == 'TENANT_NOT_FOUND') {
                throw new ForbiddenException('Tenant not found', 'Forbidden');
            } else {
                throw new NotFoundException(e, 'Not found');
            }
        }
    }

    async findAllSubscriptionByQuery(
        data: FindAllSubscriptionByQueryRequestDTO,
    ): Promise<FindAllSubscriptionResponse> {
        try {
            const subscriptions: FindAllSubscriptionResponse = await firstValueFrom(
                this.iSubscriptionService.findAllSubscriptionByQuery(data),
            );
            return subscriptions;
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
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async findAllSubscriptionByQueryAdmin(
        data: FindAllSubscriptionByQueryAdminRequestDTO,
    ): Promise<FindAllSubscriptionResponse> {
        try {
            const subscriptions: FindAllSubscriptionResponse = await firstValueFrom(
                this.iSubscriptionService.findAllSubscriptionByQueryAdmin(data),
            );
            return subscriptions;
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
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async findPlans(data: FindPlansRequestDTO): Promise<FindPlansResponse> {
        try {
            // console.log(data)
            const planResponse: FindPlansResponse = await firstValueFrom(
                this.iSubscriptionService.findPlans(data),
            );
            return planResponse;
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

            throw new NotFoundException(
                `Unhandled error type: ${errorDetails.error}`,
                'Error not recognized',
            );
        }
    }

    async updateSubscriptionStageByAdmin(
        data: UpdateSubscriptionStageByAdminRequestDTO,
    ): Promise<SubscriptionResponse> {
        try {
            // console.log(this.iSubscriptionService.createTenant(data));
            const subscriptionResponse: SubscriptionResponse = await firstValueFrom(
                this.iSubscriptionService.updateSubscriptionStageByAdmin(data),
            );
            return subscriptionResponse;
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
            } else if (errorDetails.error == 'SUBSCRIPTION_NOT_FOUND') {
                throw new ForbiddenException('Subscription not found', 'Forbidden');
            } else {
                throw new NotFoundException(e, 'Not found');
            }
        }
    }

    async cancelSubscription(data: CancelSubscriptionRequestDTO): Promise<SubscriptionResponse> {
        try {
            const subscriptionResponse: SubscriptionResponse = await firstValueFrom(
                this.iSubscriptionService.cancelSubscription(data),
            );
            return subscriptionResponse;
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
            } else if (errorDetails.error == 'SUBSCRIPTION_NOT_FOUND') {
                throw new ForbiddenException('Subscription not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }
}
