import { Observable, firstValueFrom, lastValueFrom, take, toArray } from 'rxjs';
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ForbiddenException, UserNotFoundException } from 'src/common/exceptions/exceptions';
import { ListBankResquest } from 'src/proto_build/payment/bank/ListBankResquest';
import { ListBankResponse } from 'src/proto_build/payment/bank/ListBankResponse';
import { Bank } from 'src/proto_build/payment/bank/Bank';

interface BankService {
    getBank(data: ListBankResquest): Observable<ListBankResponse>;
}

@Injectable()
export class PaymentBankService implements OnModuleInit {
    private iBankService: BankService;

    constructor(@Inject('GRPC_TENANT_PAYMENT') private client: ClientGrpc) {}

    onModuleInit() {
        this.iBankService = this.client.getService<BankService>('BankService');
    }

    async getBank(data: ListBankResquest): Promise<ListBankResponse> {
        try {
            // console.log(this.iPolicyAndTermService.createTenant(data));
            const listBankResponse: ListBankResponse = await firstValueFrom(
                this.iBankService.getBank(data),
            );
            return listBankResponse;
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
