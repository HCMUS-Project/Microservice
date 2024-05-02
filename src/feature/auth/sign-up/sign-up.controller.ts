import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { AuthServiceSignUp } from './sign-up.service';
import { SignUpRequestDto } from './sign-up.dto';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOperation,
    ApiProperty,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class SignUpController {
    constructor(
        @Inject('GRPC_AUTH_SERVICE_SIGN_UP')
        private readonly authServiceSignUp: AuthServiceSignUp,
    ) {}

    @Post('sign-up')
    @ApiOperation({
        summary: 'Sign up into user site',
        description: `
## Must have domain in body,
## Must have device in body`,
    })
    @ApiBody({
        type: SignUpRequestDto,
        examples: {
            user_1: {
                value: {
                    email: 'nguyenvukhoi150402@gmail.com',
                    username: 'vukhoi5a',
                    phone: '84931056895',
                    password: 'A@a123456',
                    domain: '30shine.com',
                    device: 'web',
                } as SignUpRequestDto,
            },
            user_2: {
                value: {
                    email: 'volehoai070902@gmail.com',
                    username: 'vukhoi123',
                    phone: '84944236565',
                    password: '1232@asdS',
                    domain: '24shine.com',
                    device: 'mobile',
                } as SignUpRequestDto,
            },
        },
    })
    @ApiCreatedResponse({
        description: 'User created successfully!!',
        content: {
            'application/json': {
                examples: {
                    created_user: {
                        summary: 'Response after sign up successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-04-24T06:51:55.536Z',
                            path: '/api/auth/sign-up',
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
                    all_field_missing: {
                        summary: 'Response if all field missing and not valid with request',
                        value: {
                            statusCode: 400,
                            timestamp: '2024-04-26T06:55:35.138Z',
                            path: '/api/auth/sign-up',
                            message:
                                'email should not be empty, email must be an email, username should not be empty, phone should not be empty, Must be VietNam Phone Number (84..), Password must have at least 8 characters, 1 lowercase letters, 1 uppercase letters, 1 numbers, 1 symbols., domain should not be empty, domain must be a valid domain name, device should not be empty',
                            error: 'Bad Request',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    @ApiForbiddenResponse({
        description: 'Forbidden Request',
        content: {
            'application/json': {
                examples: {
                    all_field_missing: {
                        summary: 'Response if user already existed',
                        value: {
                            statusCode: 403,
                            timestamp: '2024-04-24T07:14:49.936Z',
                            path: '/api/auth/sign-up',
                            message: 'User already registered',
                            error: 'Forbidden',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async signUp(@Body() data: SignUpRequestDto) {
        return await this.authServiceSignUp.signUp(data);
    }
}
