import { Body, Controller, Get, Inject, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOperation,
    ApiProperty,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { UserDto } from '../../commonDTO/user.dto';
import { AuthServiceRefreshToken } from './refresh-token.service';
import { RefreshTokenGuard } from 'src/common/guards/token/refreshToken.guard';

@Controller('auth')
@ApiTags('auth')
export class RefreshTokenController {
    constructor(
        @Inject('GRPC_AUTH_SERVICE_REFRESH_TOKEN')
        private readonly authServiceRefreshToken: AuthServiceRefreshToken,
    ) {}

    @UseGuards(RefreshTokenGuard)
    @Post('refresh-token')
    @ApiOperation({
        summary: 'Refresh token',
        description: `
## Mustn't have body,
## Using refresh token (to test add in the right corner)`,
    })
    @ApiBearerAuth('JWT-refresh-token')
    @ApiCreatedResponse({
        description: 'Refresh Token successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after get refresh token successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-04-24T08:33:21.235Z',
                            path: '/api/auth/refresh-token',
                            message: null,
                            error: null,
                            data: {
                                accessToken:
                                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiIzMHNoaW5lLmNvbSIsImVtYWlsIjoibmd1eWVudnVraG9pMTUwNDAyQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzEzOTQ3NjAxLCJleHAiOjE3MTM5NDg1MDF9._yiv05zWcAppiTCkOmj88p8Y_0Ln7rQ8KjbrueIk4gU',
                                refreshToken:
                                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiIzMHNoaW5lLmNvbSIsImVtYWlsIjoibmd1eWVudnVraG9pMTUwNDAyQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzEzOTQ3NjAxLCJleHAiOjE3MTQwMzQwMDF9.KacM6EceSfFV3ULk_tnktN096y2EmOUGcppdJY0utNs',
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
                            timestamp: '2024-04-24T08:44:46.091Z',
                            path: '/api/auth/refresh-token',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                    access_token_not_found: {
                        summary: 'Refresh token not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-24T08:45:10.751Z',
                            path: '/api/auth/refresh-token',
                            message: 'Refresh Token not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async refreshToken(@Req() req: Request) {
        const payloadToken = req['user'];
        const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(payloadToken, header);
        return await this.authServiceRefreshToken.refreshToken({
            user: userData,
            refreshToken: header['authorization'].split(' ')[1],
        });
    }
}
