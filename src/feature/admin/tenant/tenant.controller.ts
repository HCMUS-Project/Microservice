import { Body, Controller, Get, Inject, Post, Query, Req, UseGuards } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiHeader,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminServiceTenant } from './tenant.service';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { RolesGuard } from 'src/common/guards/role/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import {
    ApiBodyExample,
    ApiEndpoint,
    ApiErrorResponses,
    ApiQueryExamples,
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';

import { UserDto } from 'src/feature/commonDTO/user.dto';
import {
    GetTenant,
    GetTenantRequestDTO,
    SetTenantDomain,
    SetTenantDomainRequestDTO,
    SetTenantStage,
    SetTenantStageRequestDTO,
    Verify,
    VerifyRequestDTO,
} from './tenant.dto';

@Controller('admin/tenant')
@ApiTags('admin/tenant')
export class TenantController {
    constructor(
        @Inject('GRPC_ADMIN_SERVICE_TENANT')
        private readonly adminServiceTenant: AdminServiceTenant,
    ) {}

    @Get('get')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-access-token-admin')
    @ApiEndpoint({
        summary: `Get Tenant`,
        details: `
## Description
Get a Tenant information within a domain using an access token. This operation is restricted to admin accounts only.
        
## Requirements
- **Access Token**: Must provide a valid admin access token.
- **Permissions**: Requires admin-level permissions.
- **type**: type is example
`,
    })
    @ApiQueryExamples([
        {
            name: 'type',
            description: 'type of Tenant active: true or false',
            example: true,
            required: false,
        },
    ])
    @ApiResponseExample(
        'read',
        'read Tenant from Admin site',
        {
            tenant: [
                {
                    tenant: {
                        email: 'nhinhihcbdethuong@gmail.com',
                        username: 'nhinhihcbdethuong',
                        role: '2',
                        domain: '',
                        isDeleted: false,
                        isActive: false,
                        isVerified: false,
                        isRejected: false,
                        createdAt: 'undefined',
                    },
                    tenantProfile: {
                        username: 'nhinhihcbdethuong',
                        email: 'nhinhihcbdethuong@gmail.com',
                        phone: '0931056895',
                        gender: 'unknown',
                        address: '123 abc, phuong X, quan Y, thanh pho Z',
                        age: 18,
                        avatar: 'none',
                        name: 'Nguyen Van A',
                        stage: 'new',
                        createdAt: 'undefined',
                        isVerify: false,
                    },
                },
            ],
        },
        '/api/admin/tenant/get?type=false',
    )
    @ApiErrorResponses('/api/admin/tenant/get?type=false', '/api/admin/tenant/get?type=false', {
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
        ],
        forbidden: [
            {
                key: 'forbidden_resource',
                summary: 'Forbidden resource',
                detail: 'Forbidden resource',
            },
        ],
    })
    async getTenant(@Req() req: Request, @Query() data: GetTenant) {
        const payloadToken = req['user'];
        const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(data, userData);
        return await this.adminServiceTenant.getTenant({
            ...data,
            user: userData,
        } as GetTenantRequestDTO);
    }

    @Post('verify')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-access-token-admin')
    @ApiOperation({
        summary: 'Verify tenant',
        description: `
## Description
Verify a Tenant within a domain using an access token. This operation is restricted to admin accounts only.
        
## Requirements
- **Access Token**: Must provide a valid admin access token.
- **Permissions**: Requires admin-level permissions.
`,
    })
    @ApiBodyExample(Verify, {
        email: 'nguyenvukhoi150402@gmail.com',
        isVerify: true,
    })
    @ApiResponseExample(
        'update',
        'Verify Tenant from Admin Site',
        {
            tenant: {
                email: 'nguyenvukhoi150402@gmail.com',
                username: 'nguyenvukhoi150402',
                role: '2',
                domain: '30shine.com',
                isDeleted: false,
                isActive: true,
                isVerified: true,
                isRejected: false,
                createdAt: 'undefined',
            },
        },
        '/api/admin/tenant/verify',
    )
    @ApiErrorResponses('/api/admin/tenant/verify', '/api/admin/tenant/verify', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'email should not be empty, email must be an email, isVerify should not be empty, isVerify must be a boolean value',
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
        ],
        forbidden: [
            {
                key: 'forbidden_resource',
                summary: 'Forbidden resource',
                detail: 'Forbidden resource',
            },
            {
                key: 'not_found',
                summary: 'Tenant not found',
                detail: 'Tenant not found',
            },
            {
                key: 'not_activated',
                summary: 'Tenant not activated',
                detail: 'Tenant not activated',
            },
            {
                key: 'not_verified',
                summary: 'Tenant not verified',
                detail: 'Tenant not verified',
            },
            {
                key: 'already_verified',
                summary: 'Tenant already verified',
                detail: 'Tenant already verified',
            },
        ],
    })
    async verify(@Req() req: Request, @Body() data: Verify) {
        // console.log(req['user'], req.headers, req.body)
        // return 'success'
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;

        return await this.adminServiceTenant.verify({
            ...data,
            user: userData,
        } as VerifyRequestDTO);
    }

    @Post('stage/set')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-access-token-admin')
    @ApiOperation({
        summary: 'Set tenant stage',
        description: `
## Description
Set Tenant stage within a domain using an access token. This operation is restricted to admin accounts only.
        
## Requirements
- **Access Token**: Must provide a valid admin access token.
- **Permissions**: Requires admin-level permissions.
`,
    })
    @ApiBodyExample(SetTenantStage, {
        tenantprofile: {
            username: 'nguyenvukhoi150402',
            email: 'nguyenvukhoi150402@gmail.com',
            phone: '84931056895',
            gender: 'unknown',
            address: 'anh yeu em',
            age: 18,
            avatar: 'none',
            name: 'Nguyen Van A',
            stage: 'good',
            createdAt: 'undefined',
            isVerify: true,
        },
    })
    @ApiResponseExample(
        'update',
        'set Tenant Stage from Admin site',
        { email: 'nguyenvukhoi150402@gmail.com', stage: 'good' },
        '/api/admin/tenant/stage/set',
    )
    @ApiErrorResponses('/api/admin/tenant/stage/set', '/api/admin/tenant/stage/set', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'email should not be empty, email must be an email, stage should not be empty, stage must be a string',
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
        ],
        forbidden: [
            {
                key: 'forbidden_resource',
                summary: 'Forbidden resource',
                detail: 'Forbidden resource',
            },
            {
                key: 'not_found',
                summary: 'Tenant not found',
                detail: 'Tenant not found',
            },
            {
                key: 'not_updated',
                summary: 'Tenant not updated',
                detail: 'Tenant not updated',
            },
        ],
    })
    async setTenantStage(@Req() req: Request, @Body() data: SetTenantStage) {
        // console.log(req['user'], req.headers, req.body)
        // return 'success'
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;

        return await this.adminServiceTenant.setTenantStage({
            ...data,
            user: userData,
        } as SetTenantStageRequestDTO);
    }

    @Post('domain/set')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-access-token-admin')
    @ApiOperation({
        summary: 'Set tenant domain',
        description: `
## Description
Set Tenant domain within a domain using an access token. This operation is restricted to admin accounts only.
        
## Requirements
- **Access Token**: Must provide a valid admin access token.
- **Permissions**: Requires admin-level permissions.
`,
    })
    @ApiBodyExample(SetTenantDomain, {
        email: 'nguyenvukhoi150402@gmail.com',
        domain: '30shinee.com',
    })
    @ApiResponseExample(
        'update',
        'set Tenant Domain from Admin site',
        {
            tenant: {
                email: 'nguyenvukhoi150402@gmail.com',
                username: 'nguyenvukhoi150402',
                role: '2',
                domain: '30shinee.com',
                isDeleted: false,
                isActive: true,
                isVerified: true,
                isRejected: false,
                createdAt: 'undefined',
            },
            tenantProfile: {
                username: 'nguyenvukhoi150402',
                email: 'nguyenvukhoi150402@gmail.com',
                phone: '84931056895',
                gender: 'unknown',
                address: 'anh yeu em',
                age: 18,
                avatar: 'none',
                name: 'Nguyen Van A',
                stage: 'something',
                createdAt: 'undefined',
                isVerify: true,
            },
        },
        '/api/admin/tenant/domain/set',
    )
    @ApiErrorResponses('/api/admin/tenant/domain/set', '/api/admin/tenant/domain/set', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'email should not be empty, email must be an email, domain should not be empty, domain must be a URL address',
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
        ],
        forbidden: [
            {
                key: 'forbidden_resource',
                summary: 'Forbidden resource',
                detail: 'Forbidden resource',
            },
            {
                key: 'not_found',
                summary: 'Tenant not found',
                detail: 'Tenant not found',
            },
            {
                key: 'not_updated',
                summary: 'Tenant not updated',
                detail: 'Tenant not updated',
            },
        ],
    })
    async setTenantDomain(@Req() req: Request, @Body() data: SetTenantDomain) {
        // console.log(req['user'], req.headers, req.body)
        // return 'success'
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;

        return await this.adminServiceTenant.setTenantDomain({
            ...data,
            user: userData,
        } as SetTenantDomainRequestDTO);
    }
}
