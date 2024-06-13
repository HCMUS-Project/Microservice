import { Body, Controller, Inject, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthServiceSignIn } from './sign-in.service';
import { ChangePassword, ChangePasswordRequestDTO, SignInRequestDTO } from './sign-in.dto';
import {
    ApiBadGatewayResponse,
    ApiBadRequestResponse,
    ApiBearerAuth,
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
import {
    ApiBodyExample,
    ApiEndpoint,
    ApiErrorResponses,
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';
import { UserDto } from 'src/feature/commonDTO/user.dto';

@Controller('auth')
@ApiTags('auth')
export class SignInController {
    constructor(
        @Inject('GRPC_AUTH_SERVICE_SIGN_IN')
        private readonly authServiceSignIn: AuthServiceSignIn,
    ) {}

    @Post('sign-in')
    @ApiEndpoint({
        summary: `Sign In`,
        details: `
## Description
Sign In within a domain.
        
## Requirements
`,
    })
    @ApiBodyExample(SignInRequestDTO, {
        email: 'nguyenvukhoi150402@gmail.com',
        password: 'A@a123456',
        role: 2,
    })
    @ApiResponseExample(
        'create',
        'Sign in',
        {
            accessToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiIzMHNoaW5lLmNvbSIsImVtYWlsIjoibmd1eWVudnVraG9pMTUwNDAyQGdtYWlsLmNvbSIsInJvbGUiOjAsImlhdCI6MTcxMzk0Mzc2OCwiZXhwIjoxNzEzOTQ0NjY4fQ.Dc8Aoh0QDCheZIOA56n-wlBLqnSnYjGOZCIKU6KhgVg',
            refreshToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiIzMHNoaW5lLmNvbSIsImVtYWlsIjoibmd1eWVudnVraG9pMTUwNDAyQGdtYWlsLmNvbSIsInJvbGUiOjAsImlhdCI6MTcxMzk0Mzc2OCwiZXhwIjoxNzE0MDMwMTY4fQ.3pPDcmG6lPEOtARDzXYI5I-YZoYZNjNcEKSoQ2iA_rs',
        },
        '/api/auth/sign-in',
    )
    @ApiErrorResponses('/api/auth/sign-in', '/api/auth/sign-in', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'email should not be empty, email must be an email, password should not be empty, password must have non-empty password., domain should not be empty, domain must be a valid domain name, role must be a number conforming to the specified constraints',
        },
        unauthorized: [
            {
                key: 'user_not_found',
                summary: 'User not found',
                detail: 'User not found',
                error: 'Unauthorized',
            },
            {
                key: 'invalid_password',
                summary: 'Invalid password',
                detail: 'Invalid password',
                error: 'Unauthorized',
            },
            {
                key: 'not_verified',
                summary: 'User not verified',
                detail: 'User not verified',
                error: 'Unauthorized',
            },
            {
                key: 'tenant_not_found',
                summary: 'Tenant not found',
                detail: 'Tenant not found',
                error: 'Unauthorized',
            },
            {
                key: 'tenant_not_actived',
                summary: 'Tenant not actived',
                detail: 'Tenant not actived',
                error: 'Unauthorized',
            },
            {
                key: 'tenant_not_verified',
                summary: 'Tenant not verified',
                detail: 'Tenant not verified',
                error: 'Unauthorized',
            },
        ],
    })
    async signIn(@Body() data: SignInRequestDTO) {
        return await this.authServiceSignIn.signIn(data);
    }

    @Post('change-password')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Change Password`,
        details: `
## Description
Change Password within a domain using an access token. 
        
## Requirements
- **Access Token**: Must provide a valid access token.
`,
    })
    @ApiBodyExample(ChangePassword, { password: 'A@a123456', newPassword: 'A@a654321' })
    @ApiResponseExample(
        'update',
        'Change Password',
        { result: 'Tenant password changed successfully' },
        '/api/auth/change-password',
    )
    @ApiErrorResponses('/api/auth/change-password', '/api/auth/change-password', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'password should not be empty, password must have non-empty password., newPassword should not be empty, newPassword must have non-empty password.',
        },
        unauthorized: [
            {
                key: 'user_not_found',
                summary: 'User not found',
                detail: 'User not found',
                error: 'Unauthorized',
            },
            {
                key: 'invalid_password',
                summary: 'Invalid password',
                detail: 'Invalid password',
                error: 'Unauthorized',
            },
            {
                key: 'not_verified',
                summary: 'User not verified',
                detail: 'User not verified',
                error: 'Unauthorized',
            },
            {
                key: 'tenant_not_found',
                summary: 'Tenant not found',
                detail: 'Tenant not found',
                error: 'Unauthorized',
            },
            {
                key: 'tenant_not_actived',
                summary: 'Tenant not actived',
                detail: 'Tenant not actived',
                error: 'Unauthorized',
            },
            {
                key: 'tenant_not_verified',
                summary: 'Tenant not verified',
                detail: 'Tenant not verified',
                error: 'Unauthorized',
            },
        ],
    })
    async changePassword(@Req() req: Request, @Body() data: ChangePassword) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.authServiceSignIn.changePassword({
            user: userData,
            ...data,
        } as ChangePasswordRequestDTO);
    }
}
