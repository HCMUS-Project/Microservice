import { Observable, firstValueFrom, lastValueFrom, take, toArray } from 'rxjs';
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ForbiddenException, UserNotFoundException } from 'src/common/exceptions/exceptions';
import {SubscriptionResponse} from 'src/proto_build/tenant/subscription/SubscriptionResponse';
import {CreateSubscriptionRequestDTO, DeleteSubscriptionRequestDTO, FindSubscriptionByTenantIdRequestDTO, UpdateSubscriptionRequestDTO} from './subscription.dto';
 

interface SubscriptionService {
    createSubscription(data: CreateSubscriptionRequestDTO): Observable<SubscriptionResponse>;
    findSubscriptionByTenantId(
        data: FindSubscriptionByTenantIdRequestDTO,
    ): Observable<SubscriptionResponse>;
    updateSubscription(data: UpdateSubscriptionRequestDTO): Observable<SubscriptionResponse>;
    deleteSubscription(data: DeleteSubscriptionRequestDTO): Observable<SubscriptionResponse>;
}

@Injectable()
export class TenantSubscriptionService implements OnModuleInit {
    private iSubscriptionService: SubscriptionService;

    constructor(@Inject('GRPC_TENANT_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iSubscriptionService = this.client.getService<SubscriptionService>('SubscriptionService');
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
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'SUBSCRIPTION_ALREADY_EXISTS') {
                throw new ForbiddenException('Subscription already exists', 'Forbidden');
            } else if (errorDetails.error == 'INVALID_TENANT_ID') {
                throw new ForbiddenException('Invalid tenant id', 'Forbidden');
            } else {
                throw new NotFoundException(e, 'Not found');
            }
        }
    }

    async findSubscriptionByTenantId(
        data: FindSubscriptionByTenantIdRequestDTO,
    ): Promise<SubscriptionResponse> {
        try {
            const subscriptionResponse: SubscriptionResponse = await firstValueFrom(
                this.iSubscriptionService.findSubscriptionByTenantId(data),
            );
            return subscriptionResponse;
        } catch (e) {
            // console.log(e);
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'SUBSCRIPTION_NOT_FOUND') {
                throw new UserNotFoundException('Subscription not found');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async updateSubscription(data: UpdateSubscriptionRequestDTO): Promise<SubscriptionResponse> {
        try {
            // console.log(data)
            const subscriptionResponse: SubscriptionResponse = await firstValueFrom(
                this.iSubscriptionService.updateSubscription(data),
            );
            return subscriptionResponse;
        } catch (e) {
            // console.log(e);
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'SUBSCRIPTION_NOT_FOUND') {
                throw new UserNotFoundException('Subscription not found');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async deleteSubscription(data: DeleteSubscriptionRequestDTO): Promise<SubscriptionResponse> {
        try {
            const subscriptionResponse: SubscriptionResponse = await firstValueFrom(
                this.iSubscriptionService.deleteSubscription(data),
            );
            return subscriptionResponse;
        } catch (e) {
            // console.log(e);
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'SUBSCRIPTION_NOT_FOUND') {
                throw new UserNotFoundException('Subscription not found');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }
}
