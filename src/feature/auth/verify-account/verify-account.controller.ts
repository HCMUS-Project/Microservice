import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthServiceVerifyAccount } from './verify-account.service';
import { VerifyAccountRequest } from 'src/proto-build/verifyAccount/VerifyAccountRequest';
import { SendMailRequest } from 'src/proto-build/verifyAccount/SendMailRequest';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SendMailRequestDto, VerifyAccountRequestDto } from './verify-account.dto';

@Controller('/auth')
@ApiTags('auth')
export class VerifyAccountController {
    constructor(
        @Inject('GRPC_AUTH_SERVICE_VERIFY_ACCOUNT')
        private readonly authServiceVerifyAccount: AuthServiceVerifyAccount,
    ) {}

    @Post('verify-account')
    @ApiOperation({
        summary: 'Verify OTP of new account',
        description: `
## Must have domain in body,
## Must have otp in body`,
    })
    @ApiBody({
        type: VerifyAccountRequestDto,
        examples: {
            user_1: {
                value: {
                    domain: '30shine.com',
                    email: 'nguyenvukhoi150402@gmail.com',
                    otp: '873735',
                } as VerifyAccountRequestDto,
            },
            user_2: {
                value: {
                    domain: '24shine.com',
                    email: 'nguyenvukhoi150402@gmail.com',
                    otp: '812332',
                } as VerifyAccountRequestDto,
            },
        },
    })
    @ApiCreatedResponse({
        description: 'Verify OTP successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after verify OTP successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-04-24T07:56:03.452Z',
                            path: '/api/auth/verify-account',
                            message: null,
                            error: null,
                            data: {
                                result: 'success',
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Validation failed',
        content: {
            'application/json': {
                examples: {
                    fields_missing: {
                        value: {
                            statusCode: 400,
                            timestamp: '2024-04-24T07:50:48.659Z',
                            path: '/api/auth/verify-account',
                            message:
                                'email should not be empty, email must be an email, domain should not be empty, domain must be a valid domain name, otp should not be empty, otp must be a number string',
                            error: 'Bad Request',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Authorization failed',
        content: {
            'application/json': {
                examples: {
                    user_not_found: {
                        summary: 'User not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-24T07:51:27.101Z',
                            path: '/api/auth/verify-account',
                            message: 'User not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    @ApiForbiddenResponse({
        description: 'Forbidden response',
        content: {
            'application/json': {
                examples: {
                    user_already_verified: {
                        summary: 'User already verified',
                        value: {
                            statusCode: 403,
                            timestamp: '2024-04-24T07:42:57.623Z',
                            path: '/api/auth/send-mail-otp',
                            message: 'User already verified',
                            error: 'Forbidden',
                            data: null,
                        },
                    },
                    otp_already_expired: {
                        summary: 'Otp already expired',
                        value: {
                            statusCode: 403,
                            timestamp: '2024-04-24T07:52:35.656Z',
                            path: '/api/auth/verify-account',
                            message: 'Otp already expired',
                            error: 'Forbidden',
                            data: null,
                        },
                    },
                    otp_already_invalid: {
                        summary: 'Otp already invalid',
                        value: {
                            statusCode: 403,
                            timestamp: '2024-04-24T07:52:35.656Z',
                            path: '/api/auth/verify-account',
                            message: 'Otp already invalid',
                            error: 'Forbidden',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async verifyAccount(@Body() data: VerifyAccountRequestDto) {
        return await this.authServiceVerifyAccount.verifyAccount(data);
    }

    @Post('send-mail-otp')
    @ApiOperation({
        summary: 'Send otp to gmail which is used to sign up',
        description: `
## Must have domain in body`,
    })
    @ApiBody({
        type: SendMailRequestDto,
        examples: {
            user_1: {
                value: {
                    domain: '30shine.com',
                    email: 'nguyenvukhoi150402@gmail.com',
                } as SendMailRequestDto,
            },
            user_2: {
                value: {
                    domain: '24shine.com',
                    email: 'nguyenvukhoi150402@gmail.com',
                } as SendMailRequestDto,
            },
        },
    })
    @ApiCreatedResponse({
        description: 'Send OTP successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after send otp to gmail successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-04-24T07:44:47.453Z',
                            path: '/api/auth/send-mail-otp',
                            message: null,
                            error: null,
                            data: {
                                result: 'success',
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Validation failed',
        content: {
            'application/json': {
                examples: {
                    fields_missing: {
                        value: {
                            statusCode: 400,
                            timestamp: '2024-04-24T07:39:35.815Z',
                            path: '/api/auth/send-mail-otp',
                            message:
                                'email should not be empty, email must be an email, domain should not be empty, domain must be a valid domain name',
                            error: 'Bad Request',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Authorization failed',
        content: {
            'application/json': {
                examples: {
                    user_not_found: {
                        summary: 'User not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-24T07:40:59.411Z',
                            path: '/api/auth/send-mail-otp',
                            message: 'User not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    @ApiForbiddenResponse({
        description: 'Forbidden response',
        content: {
            'application/json': {
                examples: {
                    user_already_verified: {
                        summary: 'User already verified',
                        value: {
                            statusCode: 403,
                            timestamp: '2024-04-24T07:42:57.623Z',
                            path: '/api/auth/send-mail-otp',
                            message: 'User already verified',
                            error: 'Forbidden',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async sendMailOtp(@Body() data: SendMailRequestDto) {
        return await this.authServiceVerifyAccount.sendMailOtp(data);
    }
}
