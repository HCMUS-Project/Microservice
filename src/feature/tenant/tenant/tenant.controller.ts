import { Body, Controller, Delete, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { RolesGuard } from 'src/common/guards/role/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import {
    ApiBodyExample,
    ApiEndpoint,
    ApiErrorResponses,
    ApiParamExamples,
    ApiQueryExamples,
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';
import { TenantTenantService } from './tenant.service';
import {
    CreateTenant,
    CreateTenantRequestDTO,
    DeleteTenant,
    DeleteTenantRequestDTO,
    FindTenantByDomainRequestDTO,
    FindTenantByIdRequestDTO,
    UpdateTenant,
    UpdateTenantRequestDTO,
} from './tenant.dto';
import { FindTenantByIdRequest } from 'src/proto_build/tenant/tenant/FindTenantByIdRequest';

@Controller('tenant/tenants')
@ApiTags('tenant/tenants')
export class TenantController {
    constructor(
        @Inject('GRPC_TENANT_SERVICE_TENANT')
        private readonly tenantTenantService: TenantTenantService,
    ) {}

    @Post('create')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Create a tenant`,
        details: `
## Description
Create a tenant within a domain using an access token. This operation is restricted to tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
`,
    })
    @ApiBodyExample(CreateTenant, { name: 'Vo Le Hoai' })
    @ApiResponseExample(
        'create',
        'create Tenant',
        {
            tenant: {
                id: 'c92dfb91-fa7d-496b-b4fc-3b5cbfc25667',
                ownerId: 'nguyenvukhoi150402@gmail.com',
                name: 'Vo Le Hoai',
                domain: '30shine.com',
                isLocked: false,
                createdAt: '2024-05-20T08:17:25.253Z',
                updatedAt: '2024-05-20T08:17:25.253Z',
            },
        },
        '/api/tenant/tenants/create',
    )
    @ApiErrorResponses('/api/tenant/tenants/create', '/api/tenant/tenants/create', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'name should not be empty, name must be a string',
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
                key: 'already_exists',
                summary: 'Tenant already exists',
                detail: 'Tenant already exists',
            },
        ],
    })
    async createTenant(@Req() req: Request, @Body() data: CreateTenant) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantTenantService.createTenant({
            user: userData,
            ...data,
        } as CreateTenantRequestDTO);
    }

    @Get('find/domain')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Find tenant by Domain`,
        details: `
## Description
Return tenant information within a domain.

## Requirements
- **Access Token**: Must provide a valid access token.
    `,
    })
    @ApiResponseExample(
        'read',
        'find tenant by domain',
        {
            tenant: {
                id: 'c92dfb91-fa7d-496b-b4fc-3b5cbfc25667',
                ownerId: 'nguyenvukhoi150402@gmail.com',
                name: 'Vo Le Hoai',
                domain: '30shine.com',
                isLocked: false,
                createdAt: '2024-05-20T08:17:25.253Z',
                updatedAt: '2024-05-20T08:17:25.253Z',
            },
        },
        '/api/tenant/tenants/find/domain',
    )
    @ApiErrorResponses('/api/tenant/tenants/find/domain', '/api/tenant/tenants/find/domain', {
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
                key: 'forbidden_resource',
                summary: 'Forbidden resource',
                detail: 'Forbidden resource',
            },
        ],
    })
    async findTenantByDomain(@Req() req: Request) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantTenantService.findTenantByDomain({
            user: userData,
        } as FindTenantByDomainRequestDTO);
    }

    @Get('find/:id')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Find one tenant by ID`,
        details: `
## Description
Find a category within a domain using an access token.
## Requirements
- **Access Token**: Must provide a valid access token.
    `,
    })
    @ApiParamExamples([
        {
            name: 'id',
            description: 'ID of Tenant in DB',
            example: 'c92dfb91-fa7d-496b-b4fc-3b5cbfc25667',
            required: true,
        },
    ])
    @ApiResponseExample(
        'read',
        'find a Tenant by Id',
        {
            tenant: {
                id: 'c92dfb91-fa7d-496b-b4fc-3b5cbfc25667',
                ownerId: 'nguyenvukhoi150402@gmail.com',
                name: 'Vo Le Hoai',
                domain: '30shine.com',
                isLocked: false,
                createdAt: '2024-05-20T08:17:25.253Z',
                updatedAt: '2024-05-20T08:17:25.253Z',
            },
        },
        '/api/tenant/tenants/find/c92dfb91-fa7d-496b-b4fc-3b5cbfc25667',
    )
    @ApiErrorResponses(
        '/api/tenant/tenants/find/:id',
        '/api/tenant/tenants/find/c92dfb91-fa7d-496b-b4fc-3b5cbfc25667',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'id must be a UUID',
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
                    key: 'not_found',
                    summary: 'Tenant not found',
                    detail: 'Tenant not found',
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
        },
    )
    async findTenantById(@Req() req: Request, @Param() data: FindTenantByIdRequestDTO) {
        console.log(data);
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantTenantService.findTenantById({
            ...data,
        } as FindTenantByIdRequestDTO);
    }

    @Post('update')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Update a category`,
        details: `
## Description
Update a tenant within a domain using an access token. This operation is restricted to tenant accounts only.

## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
    `,
    })
    @ApiBodyExample(UpdateTenant, { name: 'Vo Le Le' })
    @ApiResponseExample(
        'update',
        'update Tenant',
        {
            tenant: {
                id: 'c92dfb91-fa7d-496b-b4fc-3b5cbfc25667',
                ownerId: 'nguyenvukhoi150402@gmail.com',
                name: 'Vo Le Le',
                domain: '30shine.com',
                isLocked: false,
                createdAt: '2024-05-20T08:17:25.253Z',
                updatedAt: '2024-05-21T08:00:41.509Z',
            },
        },
        '/api/tenant/tenants/update',
    )
    @ApiErrorResponses('/api/tenant/tenants/update', '/api/tenant/tenants/update', {
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
                key: 'not_found',
                summary: 'Tenant not found',
                detail: 'Tenant not found',
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
    async updateTenant(@Req() req: Request, @Body() updateData: UpdateTenant) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantTenantService.updateTenant({
            user: userData,
            ...updateData,
        } as UpdateTenantRequestDTO);
    }

    @Delete('delete/:id')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Delete one tenant by ID`,
        details: `
## Description
Delete a category within a domain using an access token. This operation is restricted to tenant accounts only.

## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level and user-level permissions.
    `,
    })
    @ApiParamExamples([
        {
            name: 'id',
            description: 'ID of the tenant',
            example: '57120cd8-cd91-4dc4-aba5-fa67433dded3',
            required: true,
        },
    ])
    @ApiResponseExample(
        'delete',
        'delete a tenant by Id',
        {
            tenant: {
                id: '843798d5-c547-4aab-96be-6fe7a726690c',
                ownerId: 'nguyenvukhoi150402@gmail.com',
                name: 'Vo Le Hoai',
                domain: '30shine.com',
                isLocked: false,
                createdAt: '2024-05-21T08:16:36.924Z',
                updatedAt: '2024-05-21T08:16:36.924Z',
            },
        },
        '/api/tenant/tenants/delete/57120cd8-cd91-4dc4-aba5-fa67433dded3',
    )
    @ApiErrorResponses(
        '/api/tenant/tenants/delete/:id',
        '/api/tenant/tenants/delete/57120cd8-cd91-4dc4-aba5-fa67433dded3',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'id must be a UUID',
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
                    key: 'not_found',
                    summary: 'Tenant not found',
                    detail: 'Tenant not found',
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
        },
    )
    async deleteTenant(@Req() req: Request, @Param() data: DeleteTenant) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantTenantService.deleteTenant({
            user: userData,
            ...data,
        } as DeleteTenantRequestDTO);
    }
}
