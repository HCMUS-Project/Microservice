import { Observable, firstValueFrom, lastValueFrom, take, toArray } from 'rxjs';
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ForbiddenException, UserNotFoundException } from 'src/common/exceptions/exceptions';
import { PolicyAndTermResponse } from 'src/proto_build/tenant/policyAndTerm/PolicyAndTermResponse';
import {
    CreatePaymentMethodRequestDTO,
    DeletePaymentMethodRequestDTO,
    GetPaymentMethodRequestDTO,
    ListPaymentMethodRequestDTO,
    UpdatePaymentMethodRequestDTO,
} from './paymentMethod.dto';
import { CreatePaymentMethodResponse } from 'src/proto_build/payment/paymentMethod/CreatePaymentMethodResponse';
import { GetPaymentMethodResponse } from 'src/proto_build/payment/paymentMethod/GetPaymentMethodResponse';
import { ListPaymentMethodResponse } from 'src/proto_build/payment/paymentMethod/ListPaymentMethodResponse';
import { UpdatePaymentMethodResponse } from 'src/proto_build/payment/paymentMethod/UpdatePaymentMethodResponse';
import { DeletePaymentMethodResponse } from 'src/proto_build/payment/paymentMethod/DeletePaymentMethodResponse';

interface PaymentMethodService {
    createPaymentMethod(
        data: CreatePaymentMethodRequestDTO,
    ): Observable<CreatePaymentMethodResponse>;
    getPaymentMethod(data: GetPaymentMethodRequestDTO): Observable<GetPaymentMethodResponse>;
    listPaymentMethod(data: ListPaymentMethodRequestDTO): Observable<ListPaymentMethodResponse>;
    updatePaymentMethod(
        data: UpdatePaymentMethodRequestDTO,
    ): Observable<UpdatePaymentMethodResponse>;
    deletePaymentMethod(
        data: DeletePaymentMethodRequestDTO,
    ): Observable<DeletePaymentMethodResponse>;
}

@Injectable()
export class PaymentPaymentMethodService implements OnModuleInit {
    private iPaymentMethodService: PaymentMethodService;

    constructor(@Inject('GRPC_TENANT_PAYMENT') private client: ClientGrpc) {}

    onModuleInit() {
        this.iPaymentMethodService =
            this.client.getService<PaymentMethodService>('PaymentMethodService');
    }

    async createPaymentMethod(
        data: CreatePaymentMethodRequestDTO,
    ): Promise<CreatePaymentMethodResponse> {
        try {
            // console.log(this.iPaymentMethodService.createTenant(data));
            const createPaymentMethodResponse: CreatePaymentMethodResponse = await firstValueFrom(
                this.iPaymentMethodService.createPaymentMethod(data),
            );
            return createPaymentMethodResponse;
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
            } else {
                throw new NotFoundException(e, 'Not found');
            }
        }
    }

    async getPaymentMethod(data: GetPaymentMethodRequestDTO): Promise<GetPaymentMethodResponse> {
        try {
            const getPaymentMethodResponse: GetPaymentMethodResponse = await firstValueFrom(
                this.iPaymentMethodService.getPaymentMethod(data),
            );
            return getPaymentMethodResponse;
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
            if (errorDetails.error == 'PAYMENT_METHOD_NOT_FOUND') {
                throw new UserNotFoundException('Payment method not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async listPaymentMethod(data: ListPaymentMethodRequestDTO): Promise<ListPaymentMethodResponse> {
        try {
            const listPaymentMethodResponse: ListPaymentMethodResponse = await firstValueFrom(
                this.iPaymentMethodService.listPaymentMethod(data),
            );
            return listPaymentMethodResponse;
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

    async updatePaymentMethod(
        data: UpdatePaymentMethodRequestDTO,
    ): Promise<UpdatePaymentMethodResponse> {
        try {
            // console.log(data)
            const updatePaymentMethodResponse: UpdatePaymentMethodResponse = await firstValueFrom(
                this.iPaymentMethodService.updatePaymentMethod(data),
            );
            return updatePaymentMethodResponse;
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
            } else if (errorDetails.error == 'PAYMENT_METHOD_NOT_FOUND') {
                throw new UserNotFoundException('Payment method not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async deletePaymentMethod(
        data: DeletePaymentMethodRequestDTO,
    ): Promise<DeletePaymentMethodResponse> {
        try {
            const deletePaymentMethodResponse: DeletePaymentMethodResponse = await firstValueFrom(
                this.iPaymentMethodService.deletePaymentMethod(data),
            );
            return deletePaymentMethodResponse;
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
            } else if (errorDetails.error == 'PAYMENT_METHOD_NOT_FOUND') {
                throw new UserNotFoundException('Payment method not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }
}
