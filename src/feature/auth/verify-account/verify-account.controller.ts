import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthServiceVerifyAccount } from './verify-account.service';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
    ForgotPasswordDto,
    SendMailRequestDto,
    VerifyAccountRequestDto,
} from './verify-account.dto';
import {
    ApiBodyExample,
    ApiEndpoint,
    ApiErrorResponses,
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';
import { Verify } from 'src/feature/admin/tenant/tenant.dto';

@Controller('auth')
@ApiTags('auth')
export class VerifyAccountController {
    constructor(
        @Inject('GRPC_AUTH_SERVICE_VERIFY_ACCOUNT')
        private readonly authServiceVerifyAccount: AuthServiceVerifyAccount,
    ) {}

    @Post('verify-account')
    @ApiEndpoint({
        summary: `Verify an account by OTP`,
        details: `
## Description
Verify an account of User or Tenant.
        
## Requirements
- **role**: must add if want to verify Tenant account
`,
    })
    @ApiBodyExample(VerifyAccountRequestDto, {
        email: 'nguyenvukhoi150402@gmail.com',
        otp: '007987',
        role: 2,
    })
    @ApiResponseExample(
        'update',
        'verify account',
        { result: 'success' },
        '/api/auth/verify-account',
    )
    @ApiErrorResponses('/api/auth/verify-account', '/api/auth/verify-account', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'email should not be empty, email must be an email, domain should not be empty, domain must be a valid domain name, otp should not be empty, otp must be a number string, Must be a valid type: 0, 1, 2, role must be a number conforming to the specified constraints',
        },
        unauthorized: [
            {
                key: 'user_not_found',
                summary: 'User not found',
                detail: 'User not found',
                error: 'Unauthorized',
            },
            {
                key: 'tenant_not_found',
                summary: 'Tenant not found',
                detail: 'Tenant not found',
                error: 'Unauthorized',
            },
        ],
        forbidden: [
            {
                key: 'user_already_verified',
                summary: 'User already verified',
                detail: 'User already verified',
            },
            {
                key: 'tenant_already_verified',
                summary: 'Tenant already verified',
                detail: 'Tenant already verified',
            },
            {
                key: 'otp_expired',
                summary: 'Otp already expired',
                detail: 'Otp already expired',
            },
            {
                key: 'otp_invalid',
                summary: 'Otp invalid',
                detail: 'Otp invalid',
            },
        ],
    })
    async verifyAccount(@Body() data: VerifyAccountRequestDto) {
        return await this.authServiceVerifyAccount.verifyAccount(data);
    }

    @Post('send-mail-otp')
    @ApiEndpoint({
        summary: `Send mail OTP`,
        details: `
## Description
Send OTP to email of User or Tenant.
        
## Requirements
- **role**: must add if want to send mail to Tenant account
`,
    })
    @ApiBodyExample(SendMailRequestDto, {
        email: 'nguyenvukhoi150402@gmail.com',
        role: 2,
    })
    @ApiResponseExample(
        'update',
        'send otp to mail',
        { result: 'success' },
        '/api/auth/send-mail-otp',
    )
    @ApiErrorResponses('/api/auth/send-mail-otp', '/api/auth/send-mail-otp', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'email should not be empty, email must be an email, domain should not be empty, domain must be a valid domain name, Must be a valid type: 0, 1, 2',
        },
        unauthorized: [
            {
                key: 'user_not_found',
                summary: 'User not found',
                detail: 'User not found',
                error: 'Unauthorized',
            },
            {
                key: 'tenant_not_found',
                summary: 'Tenant not found',
                detail: 'Tenant not found',
                error: 'Unauthorized',
            },
        ],
        forbidden: [
            {
                key: 'user_already_verified',
                summary: 'User already verified',
                detail: 'User already verified',
            },
            {
                key: 'tenant_already_verified',
                summary: 'Tenant already verified',
                detail: 'Tenant already verified',
            },
        ],
    })
    async sendMailOtp(@Body() data: SendMailRequestDto) {
        return await this.authServiceVerifyAccount.sendMailOtp(data);
    }

    @Post('forgot-password')
    @ApiEndpoint({
        summary: `Change to newpassword by OTP mail`,
        details: `
## Description
Change to newpassword by OTP mail.
        
## Requirements
- **role**: must add if want to verify Tenant account
`,
    })
    @ApiBodyExample(ForgotPasswordDto, {
        email: 'nguyenvukhoi150402+1@gmail.com',
        newpassword: '@Kho1i23123809123',
        otp: '338836',
        role: 2,
    })
    @ApiResponseExample(
        'update',
        'forgot password',
        { result: 'success' },
        '/api/auth/forgot-password',
    )
    @ApiErrorResponses('/api/auth/forgot-password', '/api/auth/forgot-password', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'email should not be empty, email must be an email, newpassword must have at least 8 characters, 1 lowercase letters, 1 uppercase letters, 1 symbols., otp should not be empty, otp must be a number string',
        },
        unauthorized: [
            {
                key: 'user_not_found',
                summary: 'User not found',
                detail: 'User not found',
                error: 'Unauthorized',
            },
            {
                key: 'tenant_not_found',
                summary: 'Tenant not found',
                detail: 'Tenant not found',
                error: 'Unauthorized',
            },
        ],
        forbidden: [
            {
                key: 'user_already_verified',
                summary: 'User already verified',
                detail: 'User already verified',
            },
            {
                key: 'tenant_already_verified',
                summary: 'Tenant already verified',
                detail: 'Tenant already verified',
            },
            {
                key: 'otp_expired',
                summary: 'Otp already expired',
                detail: 'Otp already expired',
            },
            {
                key: 'otp_invalid',
                summary: 'Otp invalid',
                detail: 'Otp invalid',
            },
        ],
    })
    async forgotPassword(@Body() data: ForgotPasswordDto) {
        return await this.authServiceVerifyAccount.forgotPassword(data);
    }

    @Post('send-mail-forgot-password')
    @ApiEndpoint({
        summary: `Send mail forgot password`,
        details: `
## Description
Send OTP to mail forgot password.
        
## Requirements
- **role**: must add if want to send mail to Tenant account
`,
    })
    @ApiBodyExample(SendMailRequestDto, {
        email: 'nguyenvukhoi150402@gmail.com',
        role: 2,
    })
    @ApiResponseExample(
        'update',
        'send otp when forgot password',
        { result: 'success' },
        '/api/auth/send-mail-forgot-password',
    )
    @ApiErrorResponses(
        '/api/auth/send-mail-forgot-password',
        '/api/auth/send-mail-forgot-password',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'email should not be empty, email must be an email',
            },
            unauthorized: [
                {
                    key: 'user_not_found',
                    summary: 'User not found',
                    detail: 'User not found',
                    error: 'Unauthorized',
                },
                {
                    key: 'tenant_not_found',
                    summary: 'Tenant not found',
                    detail: 'Tenant not found',
                    error: 'Unauthorized',
                },
            ],
            forbidden: [
                {
                    key: 'user_already_verified',
                    summary: 'User already verified',
                    detail: 'User already verified',
                },
                {
                    key: 'tenant_already_verified',
                    summary: 'Tenant already verified',
                    detail: 'Tenant already verified',
                },
            ],
        },
    )
    async sendMailForgotPassword(@Body() data: SendMailRequestDto) {
        return await this.authServiceVerifyAccount.sendMailForgotPassword(data);
    }
}
