import { Observable, firstValueFrom, lastValueFrom, take, toArray } from 'rxjs';
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ForbiddenException, UserNotFoundException } from 'src/common/exceptions/exceptions';
import { ListBankResquest } from 'src/proto_build/payment/bank/ListBankResquest';
import { ListBankResponse } from 'src/proto_build/payment/bank/ListBankResponse';
import { Bank } from 'src/proto_build/payment/bank/Bank';
import { CreatePaymentUrlRequestDTO } from './paymentURL.dto';
import { CreatePaymentUrlResponse } from 'src/proto_build/payment/payment/CreatePaymentUrlResponse';

interface PaymentService {
    createPaymentUrl(data: CreatePaymentUrlRequestDTO): Observable<CreatePaymentUrlResponse>;
}

@Injectable()
export class PaymentURLService implements OnModuleInit {
    private iPaymentService: PaymentService;

    constructor(@Inject('GRPC_TENANT_PAYMENT') private client: ClientGrpc) {}

    onModuleInit() {
        this.iPaymentService = this.client.getService<PaymentService>('PaymentService');
    }

    async createPaymentUrl(data: CreatePaymentUrlRequestDTO): Promise<CreatePaymentUrlResponse> {
        try {
            // console.log(this.iPolicyAndTermService.createTenant(data));
            const createPaymentUrlResponse: CreatePaymentUrlResponse = await firstValueFrom(
                this.iPaymentService.createPaymentUrl(data),
            );
            return createPaymentUrlResponse;
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

            throw new NotFoundException(e, 'Not found');
        }
    }
}
