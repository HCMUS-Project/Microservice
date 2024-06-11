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
import { ApiEndpoint, ApiErrorResponses, ApiResponseExample } from 'src/common/decorator/swagger.decorator';

@Controller('auth')
@ApiTags('auth')
export class SignOutController {
    constructor(
        @Inject('GRPC_AUTH_SERVICE_SIGN_OUT')
        private readonly authServiceSignOut: AuthServiceSignOut,
    ) {}

    @UseGuards(AccessTokenGuard)
    @Get('sign-out')
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Sign Out`,
        details: `
## Description
Sign Out for any role (delete token). 
        
## Requirements
- **Access Token**: Must provide a valid access token.
`,
    })
    @ApiResponseExample('read', 'Sign Out', { result: 'success' }, '/api/auth/sign-out')
    @ApiErrorResponses('/api/auth/sign-out', '/api/auth/sign-out', {
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
                key: 'invalid_refresh_token',
                summary: 'Invalid refresh token',
                detail: 'Invalid refresh token'
            },
            {
                key: 'invalid_refresh_token',
                summary: 'Invalid refresh token',
                detail: 'Invalid refresh token'
            }
        ]
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
