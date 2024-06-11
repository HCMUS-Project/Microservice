import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';
import {
    ForbiddenException,
    NotFoundException,
    UserNotFoundException,
} from 'src/common/exceptions/exceptions';

import { SendMailRequestDto, VerifyAccountRequestDto } from './verify-account.dto';
import { VerifyAccountResponse } from 'src/proto_build/auth/verifyAccount/VerifyAccountResponse';
import { SendMailResponse } from 'src/proto_build/auth/verifyAccount/SendMailResponse';

interface VerifyAccountService {
    verifyAccount(data: VerifyAccountRequestDto): Observable<VerifyAccountResponse>;
    sendMailOtp(data: SendMailRequestDto): Observable<SendMailResponse>;
}

@Injectable()
export class AuthServiceVerifyAccount implements OnModuleInit {
    private iVerifyAccountService: VerifyAccountService;

    constructor(@Inject('GRPC_AUTH_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iVerifyAccountService =
            this.client.getService<VerifyAccountService>('VerifyAccountService');
    }

    async verifyAccount(data: VerifyAccountRequestDto): Promise<VerifyAccountResponse> {
        try {
            const signUpResponse: VerifyAccountResponse = await firstValueFrom(
                this.iVerifyAccountService.verifyAccount(data),
            );
            return signUpResponse;
        } catch (e) {
            // console.log(e);
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            if (errorDetails.error == 'USER_NOT_FOUND') {
                throw new UserNotFoundException();
            } else if (errorDetails.error == 'USER_ALREADY_VERIFIED') {
                throw new ForbiddenException('User already verified', 'Forbidden');
            } else if (errorDetails.error == 'TENANT_NOT_FOUND') {
                throw new UserNotFoundException('Tenant not found');
            } else if (errorDetails.error == 'TENANT_ALREADY_VERIFIED') {
                throw new ForbiddenException('Tenant already verified', 'Forbidden');
            } else if (errorDetails.error == 'OTP_EXPIRED') {
                throw new ForbiddenException('Otp already expired', 'Forbidden');
            } else if (errorDetails.error == 'OTP_INVALID') {
                throw new ForbiddenException('Otp invalid', 'Forbidden');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async sendMailOtp(data: SendMailRequestDto): Promise<SendMailResponse> {
        try {
            const sendMailResponse: SendMailResponse = await firstValueFrom(
                this.iVerifyAccountService.sendMailOtp(data),
            );
            return sendMailResponse;
        } catch (e) {
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            if (errorDetails.error == 'USER_NOT_FOUND') {
                throw new UserNotFoundException();
            } else if (errorDetails.error == 'USER_ALREADY_VERIFIED') {
                throw new ForbiddenException('User already verified', 'Forbidden');
            }if (errorDetails.error == 'TENANT_NOT_FOUND') {
                throw new UserNotFoundException('Tenant not found');
            } else if (errorDetails.error == 'TENANT_ALREADY_VERIFIED') {
                throw new ForbiddenException('Tenant already verified', 'Forbidden');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }
}
