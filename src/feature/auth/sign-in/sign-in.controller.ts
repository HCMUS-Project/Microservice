import { Body, Controller, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { AuthServiceSignIn } from './sign-in.service';
import { SignInRequestDTO } from './sign-in.dto';
import {
    ApiBadGatewayResponse,
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { RolesGuard } from 'src/common/guards/role/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RefreshTokenGuard } from 'src/common/guards/token/refreshToken.guard';

@Controller('auth')
@ApiTags('auth')
export class SignInController {
    constructor(
        @Inject('GRPC_AUTH_SERVICE_SIGN_IN')
        private readonly authServiceSignIn: AuthServiceSignIn,
    ) {}

    @Post('sign-in')
    @ApiOperation({
        summary: 'Sign in into tenant and user site',
        description: `
## Must have domain in body`,
    })
    @ApiBody({
        type: SignInRequestDTO,
        examples: {
            user_1: {
                value: {
                    domain: '30shine.com',
                    email: 'nguyenvukhoi150402@gmail.com',
                    password: 'A@a123456',
                } as SignInRequestDTO,
            },
            user_2: {
                value: {
                    domain: '24shine.com',
                    email: 'nguyenvukhoi150402@gmail.com',
                    password: '1232@asdS',
                } as SignInRequestDTO,
            },
        },
    })
    @ApiCreatedResponse({
        description: 'User SignIn successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after sign in successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-04-24T07:29:28.479Z',
                            path: '/api/auth/sign-in',
                            message: null,
                            error: null,
                            data: {
                                accessToken:
                                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiIzMHNoaW5lLmNvbSIsImVtYWlsIjoibmd1eWVudnVraG9pMTUwNDAyQGdtYWlsLmNvbSIsInJvbGUiOjAsImlhdCI6MTcxMzk0Mzc2OCwiZXhwIjoxNzEzOTQ0NjY4fQ.Dc8Aoh0QDCheZIOA56n-wlBLqnSnYjGOZCIKU6KhgVg',
                                refreshToken:
                                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiIzMHNoaW5lLmNvbSIsImVtYWlsIjoibmd1eWVudnVraG9pMTUwNDAyQGdtYWlsLmNvbSIsInJvbGUiOjAsImlhdCI6MTcxMzk0Mzc2OCwiZXhwIjoxNzE0MDMwMTY4fQ.3pPDcmG6lPEOtARDzXYI5I-YZoYZNjNcEKSoQ2iA_rs',
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
                            timestamp: '2024-04-24T07:28:51.121Z',
                            path: '/api/auth/sign-in',
                            message:
                                'email should not be empty, email must be an email, Password must have at least 8 characters, 1 lowercase letters, 1 uppercase letters, 1 numbers, 1 symbols., domain should not be empty, domain must be a valid domain name',
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
                    user_not_verified: {
                        summary: 'User not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-24T07:21:33.501Z',
                            path: '/api/auth/sign-in',
                            message: 'User not verified',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                    user_not_found: {
                        summary: 'User not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-24T07:23:58.916Z',
                            path: '/api/auth/sign-in',
                            message: 'User not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                    user_invalid_password: {
                        summary: 'Invalid password',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-24T07:26:57.326Z',
                            path: '/api/auth/sign-in',
                            message: 'Invalid password',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async signIn(@Body() data: SignInRequestDTO) {
        return await this.authServiceSignIn.signIn(data);
    }

    // @Post('test-role')
    // @UseGuards(RefreshTokenGuard, RolesGuard)
    // @Roles(Role.USER)
    // async testRole(@Request() req: Request){
    //     console.log('testRole', req.headers)
    //     return 'access'
    // }
}
