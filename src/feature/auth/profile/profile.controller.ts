import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiHeader,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthServiceProfile } from './profile.service';
import {
    GetProfileRequestDTO,
    GetTenantProfileRequestDTO,
    UpdateProfileDto,
    UpdateProfileRequestDTO,
    UpdateTenantProfile,
    UpdateTenantProfileRequestDTO,
} from './profile.dto';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { RolesGuard } from 'src/common/guards/role/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import {
    ApiBodyExample,
    ApiEndpoint,
    ApiErrorResponses,
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';

@Controller('auth')
@ApiTags('auth')
export class ProfileController {
    constructor(
        @Inject('GRPC_AUTH_SERVICE_PROFILE')
        private readonly authServiceProfile: AuthServiceProfile,
    ) {}

    @Get('get-profile')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Get Profile User`,
        details: `
## Description
Get Profile of User or Tenant within a domain using an access token. 
        
## Requirements
- **Access Token**: Must provide a valid access access token. 
`,
    })
    @ApiOkResponse({
        description: 'Get profile successfully!!',
        content: {
            'application/json': {
                examples: {
                    get_profile_user: {
                        summary: 'Response after get profile user successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-04-26T07:31:57.304Z',
                            path: '/api/auth/get-profile',
                            message: null,
                            error: null,
                            data: {
                                email: 'bocuadoi1504@gmail.com',
                                role: 0,
                                username: 'bocuadoi1504',
                                domain: '30shine.com',
                                phone: '84931056895',
                                address: '123 abc, phuong X, quan Y, thanh pho Z',
                                name: 'Nguyen Van A',
                                gender: 'other',
                                age: 18,
                            },
                        },
                    },
                    get_profile_tenant: {
                        summary: 'Response after get profile tenant successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-04-26T07:31:57.304Z',
                            path: '/api/auth/get-profile',
                            message: null,
                            error: null,
                            data: {
                                tenantprofile: {
                                    username: 'nguyenvukhoi150402',
                                    email: 'nguyenvukhoi150402@gmail.com',
                                    phone: '84931056895',
                                    gender: 'unknown',
                                    address: '123 abc, phuong X, quan Y, thanh pho Z',
                                    age: 18,
                                    avatar: 'none',
                                    name: 'Nguyen Van A',
                                    stage: 'new',
                                    createdAt: 'undefined',
                                    isVerify: 'true',
                                },
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiErrorResponses('/api/auth/get-profile', '/api/auth/get-profile', {
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
            {
                key: 'user_not_found',
                summary: 'User not found',
                detail: 'User not found',
                error: 'Unauthorized',
            },
            {
                key: 'user_not_active',
                summary: 'User not active',
                detail: 'User not active',
                error: 'Unauthorized',
            },
            {
                key: 'tenant_profile_not_found',
                summary: 'Tenant profile not found',
                detail: 'Tenant profile not found',
                error: 'Unauthorized',
            },
            {
                key: 'tenant_not_active',
                summary: 'Tenant profile not active',
                detail: 'Tenant profile not active',
                error: 'Unauthorized',
            },
        ],
    })
    async getProfile(@Req() req: Request) {
        const payloadToken = req['user'];
        const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(payloadToken, header);
        if (userData.role === 0) {
            return (await this.authServiceProfile.getProfile({
                user: userData,
            })) as GetProfileRequestDTO;
        } else {
            return (await this.authServiceProfile.getTenantProfile({
                user: userData,
            })) as GetTenantProfileRequestDTO;
        }
    }

    @Post('update-profile')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.USER)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiEndpoint({
        summary: `Update Profile`,
        details: `
## Description
Update Profile within a domain using an access token. This operation is restricted to user accounts only.
        
## Requirements
- **Access Token**: Must provide a valid user access token.
- **Permissions**: Requires user-level permissions.
`,
    })
    @ApiBodyExample(UpdateProfileDto, { address: 'something' })
    @ApiResponseExample('update', 'update Profile', { result: 'success' }, '/api/auth/update-profile')
    @ApiErrorResponses('/api/auth/update-profile', '/api/auth/update-profile', {
        badRequest: {
            summary: 'Validation Error',
            detail: '',
        },
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
            {
                key: 'user_not_found',
                summary: 'User not found',
                detail: 'User not found',
                error: 'Unauthorized',
            },
            {
                key: 'user_not_active',
                summary: 'User not active',
                detail: 'User not active',
                error: 'Unauthorized',
            },
        ],
        forbidden: [
            {
                key: 'update_profile_failed',
                summary: 'Update profile failed',
                detail: 'Update profile failed',
            },
            {
                key: 'update_user_failed',
                summary: 'Update username of User table failed',
                detail: 'Update username of User table failed',
            },
        ],
    })
    async updateProfile(@Req() req: Request, @Body() updateData: UpdateProfileDto) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;

        return await this.authServiceProfile.updateProfile({
            ...updateData,
            user: userData,
        } as UpdateProfileRequestDTO);
    }

    @Post('update-profile-tenant')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Update Profile Tenant`,
        details: `
## Description
Update Profile Tenant within a domain using an access token. This operation is restricted to tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
`,
    })
    @ApiBodyExample(UpdateTenantProfile, { address: 'anh yeu em' })
    @ApiResponseExample(
        'update',
        'update Tenant Profile',
        {
            tenantprofile: {
                username: 'nguyenvukhoi150402',
                email: 'nguyenvukhoi150402@gmail.com',
                phone: '84931056895',
                gender: 'unknown',
                address: 'anh yeu em',
                age: 18,
                avatar: 'none',
                name: 'Nguyen Van A',
                stage: 'new',
                createdAt: 'undefined',
                isVerify: 'true',
            },
        },
        '/api/auth/update-profile-tenant',
    )
    @ApiErrorResponses('/api/auth/update-profile-tenant', '/api/auth/update-profile-tenant', {
        badRequest: {
            summary: 'Validation Error',
            detail: '',
        },
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
            {
                key: 'tenant_not_found',
                summary: 'Tenant not found',
                detail: 'Tenant not found',
                error: 'Unauthorized',
            },
        ],
        forbidden: [
            {
                key: 'tenant_not_verified',
                summary: 'Tenant not verified',
                detail: 'Tenant not verified',
            },
            {
                key: 'tenant_not_updated',
                summary: 'Tenant not updated',
                detail: 'Tenant not updated',
            },
        ],
    })
    async updateTenantProfile(@Req() req: Request, @Body() updateData: UpdateTenantProfile) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;

        return await this.authServiceProfile.updateTenantProfile({
            ...updateData,
            user: userData,
        } as UpdateTenantProfileRequestDTO);
    }
}
