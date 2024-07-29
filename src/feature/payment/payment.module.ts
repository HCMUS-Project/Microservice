import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PaymentBankService } from './bank/bank.service';
import { BankController } from './bank/bank.controller';
import { PaymentMethodController } from './paymentMethod/paymentMethod.controller';
import { PaymentPaymentMethodService } from './paymentMethod/paymentMethod.service';
import { PaymentURLController } from './paymentURL/paymentURL.controller';
import { PaymentURLService } from './paymentURL/paymentURL.service';

@Module({
    imports: [ClientsModule],
    controllers: [BankController, PaymentMethodController, PaymentURLController],
    providers: [
        {
            provide: 'GRPC_PAYMENT_SERVICE_BANK',
            useClass: PaymentBankService,
        },
        {
            provide: 'GRPC_PAYMENT_SERVICE_PAYMENT_METHOD',
            useClass: PaymentPaymentMethodService,
        },
        {
            provide: 'GRPC_PAYMENT_SERVICE_PAYMENT_URL',
            useClass: PaymentURLService,
        },
        {
            provide: 'GRPC_TENANT_PAYMENT',
            useFactory: (configService: ConfigService) => {
                return ClientProxyFactory.create({
                    transport: Transport.GRPC,
                    options: {
                        package: ['paymentService', 'payment', 'paymentMethod', 'bank'],
                        protoPath: join(
                            __dirname,
                            '../../../src/proto/payment/paymentService.proto',
                        ),
                        url: configService.get<string>('PAYMENT_SERVICE_URL'),
                        loader: {
                            enums: String,
                            objects: true,
                            arrays: true,
                        },
                        maxReceiveMessageLength: 1024 * 1024 * 100,
                        maxSendMessageLength: 1024 * 1024 * 100,
                    },
                });
            },
            inject: [ConfigService],
        },
    ],
})
export class PaymentModule {}
