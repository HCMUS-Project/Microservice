import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';
import {
    ForbiddenException,
    NotFoundException,
    UserNotFoundException,
} from 'src/common/exceptions/exceptions';
import { SendMailRequest } from 'src/proto-build/verifyAccount/SendMailRequest';
import { SendMailResponse } from 'src/proto-build/verifyAccount/SendMailResponse';
import { VerifyAccountRequest } from 'src/proto-build/verifyAccount/VerifyAccountRequest';
import { VerifyAccountResponse } from 'src/proto-build/verifyAccount/VerifyAccountResponse';

interface VerifyAccountService {
    verifyAccount(data: VerifyAccountRequest): Observable<VerifyAccountResponse>;
    sendMailOtp(data: SendMailRequest): Observable<SendMailResponse>;
}

@Injectable()
export class AuthServiceVerifyAccount implements OnModuleInit {
    private iVerifyAccountService: VerifyAccountService;

    constructor(@Inject('GRPC_AUTH_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iVerifyAccountService =
            this.client.getService<VerifyAccountService>('VerifyAccountService');
    }

    async verifyAccount(data: VerifyAccountRequest): Promise<VerifyAccountResponse> {
        try {
            const signUpResponse: VerifyAccountResponse = await firstValueFrom(
                this.iVerifyAccountService.verifyAccount(data),
            );
            return signUpResponse;
        } catch (e) {
            // console.log(e);
            const errorDetails = JSON.parse(e.details);
            if (errorDetails.error == 'USER_NOT_FOUND') {
                throw new UserNotFoundException(); 
            } else if (errorDetails.error == 'USER_NOT_VERIFIED') {
                throw new UserNotFoundException('User not verified');
            } else if (errorDetails.error == 'OTP_EXPIRED'){
                throw new ForbiddenException('Otp already expired', 'Forbidden')
            } else if (errorDetails.error == 'OTP_INVALID'){
                throw new ForbiddenException('Otp invalid', 'Forbidden')
            }
            else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async sendMailOtp(data: SendMailRequest): Promise<SendMailResponse> {
        try {
            const signUpResponse: SendMailResponse = await firstValueFrom(
                this.iVerifyAccountService.sendMailOtp(data),
            );
            return signUpResponse;
        } catch (e) {
            const errorDetails = JSON.parse(e.details);
            if (errorDetails.error == 'USER_NOT_FOUND') {
                throw new UserNotFoundException();
            } else if (errorDetails.error == 'USER_ALREADY_VERIFIED') {
                throw new ForbiddenException('User already registered', 'Forbidden');
            } else if (errorDetails.error == 'USER_NOT_VERIFIED') {
                throw new UserNotFoundException('User not verified');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }
}
