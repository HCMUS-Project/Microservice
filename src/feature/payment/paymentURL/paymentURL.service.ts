import { Observable, firstValueFrom, lastValueFrom, take, toArray } from 'rxjs';
import {
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CreatePaymentUrlRequestDTO } from './paymentURL.dto';
import { CreatePaymentUrlResponse } from 'src/proto_build/payment/payment/CreatePaymentUrlResponse';
import { CallBackVnpayResponse } from 'src/proto_build/payment/payment/CallBackVnpayResponse';
import { CallbackVnpayRequest } from 'src/proto_build/payment/payment/CallbackVnpayRequest';
import { UserNotFoundException } from 'src/common/exceptions/exceptions';
import Logger, { LoggerKey } from 'src/core/logger/interfaces/logger.interface';

export interface PaymentService {
    createPaymentUrl(data: CreatePaymentUrlRequestDTO): Observable<CreatePaymentUrlResponse>;
    callbackVnPay(data: any): Observable<CallBackVnpayResponse>; // Ensure this method is declared
}

@Injectable()
export class PaymentURLService implements OnModuleInit {
    private iPaymentService: PaymentService;

    constructor(
        @Inject('GRPC_TENANT_PAYMENT') private client: ClientGrpc,
        @Inject(LoggerKey) private logger: Logger,
    ) {}

    onModuleInit() {
        this.iPaymentService = this.client.getService<PaymentService>('PaymentService');
    }

    /**
     * Creates a payment URL based on the provided data.
     * @param data - The data required to create the payment URL.
     * @returns A promise that resolves to the created payment URL response.
     * @throws {UserNotFoundException} If the user is not found or has unauthorized role.
     * @throws {ForbiddenException} If the order is empty or the payment method is not found.
     * @throws {NotFoundException} If an unhandled error type occurs.
     */
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

            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role');
            }
            if (errorDetails.error == 'ORDER_EMPTY') {
                throw new ForbiddenException('Order empty');
            }
            if (errorDetails.error == 'PAYMENT_METHOD_NOT_FOUND') {
                throw new ForbiddenException('Payment method not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    /**
     * Handles the callback from Vnpay.
     * @param data - The callback data from Vnpay.
     * @param is_ipn - Indicates whether the callback is an Instant Payment Notification (IPN).
     * @returns A promise that resolves to the callback response from Vnpay.
     * @throws {NotFoundException} If an error occurs during the callback process.
     */
    async callbackVnpay(data: any, is_ipn = false): Promise<CallBackVnpayResponse> {
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
                isIpn: is_ipn,
            };
            const callbackPaymentResponse: CallBackVnpayResponse = await firstValueFrom(
                this.iPaymentService.callbackVnPay(dataRequest),
            );
            return callbackPaymentResponse;
        } catch (e) {
            this.logger.error('Error caught:', e);
            if (e.details) {
                try {
                    const errorDetails = JSON.parse(e.details);
                    throw new NotFoundException(errorDetails, 'Error recognized');
                } catch (parseError) {
                    this.logger.error('Error parsing details:', parseError);
                    throw new NotFoundException(String(e), 'Error not recognized');
                }
            } else {
                throw new NotFoundException(String(e), 'Error not recognized');
            }
        }
    }
}
