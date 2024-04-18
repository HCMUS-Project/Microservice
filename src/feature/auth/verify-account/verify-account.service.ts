import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {ClientGrpc} from '@nestjs/microservices';
import {Observable, firstValueFrom} from 'rxjs';
import {SendMailRequest} from 'src/proto-build/verify_account/SendMailRequest';
import {SendMailResponse} from 'src/proto-build/verify_account/SendMailResponse';
import {VerifyAccountRequest} from 'src/proto-build/verify_account/VerifyAccountRequest';
import {VerifyAccountResponse} from 'src/proto-build/verify_account/VerifyAccountResponse';

interface VerifyAccountService {
    verifyAccount(data: VerifyAccountRequest): Observable<VerifyAccountResponse>;
    sendMailOtp(data: SendMailRequest): Observable<SendMailResponse>
}

@Injectable()
export class AuthServiceVerifyAccount implements OnModuleInit {
    private iVerifyAccountService: VerifyAccountService;

    constructor(@Inject('GRPC_AUTH_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iVerifyAccountService = this.client.getService<VerifyAccountService>('VerifyAccountService');
    }

    async verifyAccount(data: VerifyAccountRequest): Promise<VerifyAccountResponse> {
        const signUpResponse: VerifyAccountResponse = await firstValueFrom(this.iVerifyAccountService.verifyAccount(data));
        return signUpResponse;
    }

    async sendMailOtp(data: SendMailRequest): Promise<SendMailResponse> {
        const signUpResponse: SendMailResponse = await firstValueFrom(this.iVerifyAccountService.sendMailOtp(data));
        return signUpResponse;
    }
}