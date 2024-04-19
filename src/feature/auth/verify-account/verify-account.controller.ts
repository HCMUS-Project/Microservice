import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthServiceVerifyAccount } from './verify-account.service';
import { VerifyAccountRequest } from 'src/proto-build/verifyAccount/VerifyAccountRequest';
import { SendMailRequest } from 'src/proto-build/verifyAccount/SendMailRequest';

@Controller('/auth')
export class VerifyAccountController {
    constructor(
        @Inject('GRPC_AUTH_SERVICE_VERIFY_ACCOUNT')
        private readonly authServiceVerifyAccount: AuthServiceVerifyAccount,
    ) {}

    @Post('verify-account')
    async verifyAccount(@Body() verifyAccountRequest: VerifyAccountRequest) {
        return await this.authServiceVerifyAccount.verifyAccount(verifyAccountRequest);
    }

    @Post('send-mail-otp')
    async sendMailOtp(@Body() sendMailRequest: SendMailRequest) {
        return await this.authServiceVerifyAccount.sendMailOtp(sendMailRequest);
    }
}
