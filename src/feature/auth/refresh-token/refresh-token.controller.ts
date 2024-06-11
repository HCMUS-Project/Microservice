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
import {
    ApiEndpoint,
    ApiErrorResponses,
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';

@Controller('auth')
@ApiTags('auth')
export class RefreshTokenController {
    constructor(
        @Inject('GRPC_AUTH_SERVICE_REFRESH_TOKEN')
        private readonly authServiceRefreshToken: AuthServiceRefreshToken,
    ) {}

    @Post('refresh-token')
    @UseGuards(RefreshTokenGuard)
    @ApiBearerAuth('JWT-refresh-token')
    @ApiEndpoint({
        summary: `Refresh Token`,
        details: `
## Description
Get new couple token (refresh and access). 
        
## Requirements
- **Refresh Token**: Must provide a valid refresh token.
`,
    })
    @ApiResponseExample(
        'update',
        'Refresh Token',
        {
            accessToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiIzMHNoaW5lLmNvbSIsImVtYWlsIjoibmd1eWVudnVraG9pMTUwNDAyQGdtYWlsLmNvbSIsInJvbGUiOjIsImlhdCI6MTcxODA4NTMwMCwiZXhwIjoxNzE4MDg4OTAwfQ.JTIWjcjT41e8qrdD__EU6su81_k_jUYUbMFktzqjd18',
            refreshToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiIzMHNoaW5lLmNvbSIsImVtYWlsIjoibmd1eWVudnVraG9pMTUwNDAyQGdtYWlsLmNvbSIsInJvbGUiOjIsImlhdCI6MTcxODA4NTMwMCwiZXhwIjoxNzE4MTcxNzAwfQ.nas_WI6tgfTVW7Rwy0yiBo3N1J28tBkMEVJzWB905OI',
        },
        '/api/auth/refresh-token',
    )
    @ApiErrorResponses('/api/auth/refresh-token', '/api/auth/refresh-token', {
        unauthorized: [
            {
                key: 'token_not_verified',
                summary: 'Token not verified',
                detail: 'Unauthorized',
                error: null,
            },
            {
                key: 'token_not_found',
                summary: 'Token not found',
                detail: 'Access Token not found',
                error: 'Unauthorized',
            },
            {
                key: 'unauthorized_role',
                summary: 'Role not verified',
                detail: 'Unauthorized Role',
                error: 'Unauthorized',
            },
        ],
        forbidden: [
            {
                key: 'invalid_access_token',
                summary: 'Invalid access token',
                detail: 'Invalid access token',
            },
            {
                key: 'token_expired',
                summary: 'Refresh token expired',
                detail: 'Refresh token expired',
            },
        ],
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
