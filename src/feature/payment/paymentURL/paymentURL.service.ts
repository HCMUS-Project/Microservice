import { Observable, firstValueFrom, lastValueFrom, take, toArray } from 'rxjs';
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CreatePaymentUrlRequestDTO } from './paymentURL.dto';
import { CreatePaymentUrlResponse } from 'src/proto_build/payment/payment/CreatePaymentUrlResponse';
import { CallBackVnpayResponse } from 'src/proto_build/payment/payment/CallBackVnpayResponse';
import { CallbackVnpayRequest } from 'src/proto_build/payment/payment/CallbackVnpayRequest';

export interface PaymentService {
    createPaymentUrl(data: CreatePaymentUrlRequestDTO): Observable<CreatePaymentUrlResponse>;
    callbackVnPay(data: any): Observable<CallBackVnpayResponse>; // Ensure this method is declared
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

    async callbackVnpay(data: any): Promise<CallBackVnpayResponse> {
        try {
            const dataRequest: CallbackVnpayRequest = {
                vnpTxnRef: data.vnp_TxnRef,
                vnpResponseCode: data.vnp_ResponseCode,
                vnpAmount: data.vnp_Amount,
                vnpTransactionNo: data.vnp_TransactionNo,
                vnpBankCode: data.vnp_BankCode,
                vnpBankTranNo: data.vnp_BankTranNo,
                vnpCardType: data.vnp_CardType,
                vnpPayDate: data.vnp_PayDate,
                vnpOrderInfo: data.vnp_OrderInfo,
                vnpTransactionStatus: data.vnp_TransactionStatus,
                vnpSecureHash: data.vnp_SecureHash,
                vnpTmnCode: data.vnp_TmnCode,
            };
            const callbackPaymentResponse: CallBackVnpayResponse = await firstValueFrom(
                this.iPaymentService.callbackVnPay(dataRequest),
            );
            return callbackPaymentResponse;
        } catch (e) {
            console.error('Error caught:', e);
            if (e.details) {
                try {
                    const errorDetails = JSON.parse(e.details);
                    throw new NotFoundException(errorDetails, 'Error recognized');
                } catch (parseError) {
                    console.error('Error parsing details:', parseError);
                    throw new NotFoundException(String(e), 'Error not recognized');
                }
            } else {
                throw new NotFoundException(String(e), 'Error not recognized');
            }
        }
    }
}
