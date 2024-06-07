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
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';

import { UserDto } from 'src/feature/commonDTO/user.dto';
import { GetTenant, GetTenantRequestDTO, Verify, VerifyRequestDTO } from './tenant.dto';

@Controller('admin/tenant')
@ApiTags('admin/tenant')
export class TenantController {
    constructor(
        @Inject('GRPC_AUTH_SERVICE_TENANT')
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
    @ApiResponseExample('read', 'read Tenant from Admin site', {}, '/')
    @ApiErrorResponses('/', '/api/', {
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
        // console.log(payloadToken, header);
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

    })
    @ApiResponseExample('read', 'read Tenant from Admin site', {}, '/')
    @ApiErrorResponses('/', '/api/', {
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
    @ApiBodyExample(Verify, {

    })
    @ApiResponseExample('read', 'read Tenant from Admin site', {}, '/')
    @ApiErrorResponses('/', '/api/', {
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

        ],
    })
    async setTenantStage(@Req() req: Request, @Body() data: Verify) {
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
}
