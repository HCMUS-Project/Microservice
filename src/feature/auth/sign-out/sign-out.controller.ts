import { Body, Controller, Get, Inject, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOperation,
    ApiProperty,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignOutRequestDTO } from './sign-out.dto';
import { AuthServiceSignOut } from './sign-out.service';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { UserDto } from '../../commonDTO/user.dto';

@Controller('auth')
@ApiTags('auth')
export class SignOutController {
    constructor(
        @Inject('GRPC_AUTH_SERVICE_SIGN_OUT')
        private readonly authServiceSignOut: AuthServiceSignOut,
    ) {}

    @UseGuards(AccessTokenGuard)
    @Get('sign-out')
    @ApiOperation({
        summary: 'Sign out at user site',
        description: `
## Mustn't have body,
## Using access token (to test add in the right corner)`,
    })
    @ApiBearerAuth('JWT-access-token')
    @ApiCreatedResponse({
        description: 'User SignOut successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after sign out successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-04-24T08:15:55.644Z',
                            path: '/api/auth/sign-out',
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
    @ApiUnauthorizedResponse({
        description: 'Authorization failed',
        content: {
            'application/json': {
                examples: {
                    user_not_verified: {
                        summary: 'No auth header',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-24T08:20:52.559Z',
                            path: '/api/auth/sign-out',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                    access_token_not_found: {
                        summary: 'Access token not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-24T08:21:42.967Z',
                            path: '/api/auth/sign-out',
                            message: 'Access Token not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async signOut(@Req() req: Request) {
        const payloadToken = req['user'];
        const header = req.headers;
        const data = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: 2,
            accessToken: header['authorization'].split(' ')[1],
        } as UserDto;
        // console.log(data)
        return await this.authServiceSignOut.signOut({ user: data });
    }
}
