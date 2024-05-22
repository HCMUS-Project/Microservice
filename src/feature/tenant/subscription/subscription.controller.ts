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
import { TenantSubscriptionService } from './subscription.service';
import {
    CreateSubscription,
    CreateSubscriptionRequestDTO,
    DeleteSubscription,
    DeleteSubscriptionRequestDTO,
    FindSubscriptionByTenantId,
    FindSubscriptionByTenantIdRequestDTO,
    UpdateSubscription,
    UpdateSubscriptionRequestDTO,
} from './subscription.dto';

@Controller('tenant/subscription')
@ApiTags('tenant/subscription')
export class SubscriptionController {
    constructor(
        @Inject('GRPC_TENANT_SERVICE_SUBSCRIPTION')
        private readonly tenantSubscriptionService: TenantSubscriptionService,
    ) {}

    @Post('create')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Create a subscription`,
        details: `
## Description
Create a subscription within a domain using an access token. This operation is restricted to tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
`,
    })
    @ApiBodyExample(CreateSubscription, {
        tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
        value: 10000000,
        nextBilling: '2024-06-30T00:00:28.476Z',
    })
    @ApiResponseExample(
        'create',
        'create Subcription',
        {
            subscription: {
                id: '8fbdf728-dd73-4003-8a6a-4434186c6391',
                tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                value: 10000000,
                nextBilling: '2024-06-30T00:00:28.476Z',
                createdAt: '2024-05-21T17:10:24.679Z',
                updatedAt: '2024-05-21T17:10:24.679Z',
            },
        },
        '/api/tenant/subscription/create',
    )
    @ApiErrorResponses('/api/tenant/subscription/create', '/api/tenant/subscription/create', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'tenantId should not be empty, tenantId must be a UUID, value should not be empty, value must be a positive number, nextBilling should not be empty, nextBilling must be a valid ISO 8601 date string',
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
                summary: 'Subscription already exists',
                detail: 'Subscription already exists',
            },
            {
                key: 'invalid_tenantId',
                summary: 'Invalid tenant id',
                detail: 'Invalid tenant id',
            },
        ],
    })
    async createSubscription(@Req() req: Request, @Body() data: CreateSubscription) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantSubscriptionService.createSubscription({
            user: userData,
            ...data,
        } as CreateSubscriptionRequestDTO);
    }

    @Get('find/:tenantId')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Find one Subscription by TenantID`,
        details: `
## Description
Find a Subscription by TenantId within a domain using an access token.
## Requirements
- **Access Token**: Must provide a valid access token.
`,
    })
    @ApiParamExamples([
        {
            name: 'tenantId',
            description: 'ID of Tenant in DB',
            example: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
            required: true,
        },
    ])
    @ApiResponseExample(
        'read',
        'find a Subscription by tenantId',
        {
            subscription: {
                id: '8fbdf728-dd73-4003-8a6a-4434186c6391',
                tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                value: 10000000,
                nextBilling: '2024-06-30T00:00:28.476Z',
                createdAt: '2024-05-21T17:10:24.679Z',
                updatedAt: '2024-05-21T17:10:24.679Z',
            },
        },
        '/api/tenant/subscription/find/d4d98d4c-d2f4-4d91-a6e7-2555715ce144',
    )
    @ApiErrorResponses(
        '/api/tenant/subscription/find/:tenantId',
        '/api/tenant/subscription/find/d4d98d4c-d2f4-4d91-a6e7-2555715ce145',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'tenantId must be a UUID',
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
                    summary: 'Subcription not found',
                    detail: 'Subcription not found',
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
    async findSubscriptionByTenantId(
        @Req() req: Request,
        @Param() data: FindSubscriptionByTenantId,
    ) {
        // console.log(data);
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantSubscriptionService.findSubscriptionByTenantId({
            user: userData,
            ...data,
        } as FindSubscriptionByTenantIdRequestDTO);
    }

    @Post('update')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Update a Subscription`,
        details: `
    ## Description
Update a Subcription within a domain using an access token. This operation is restricted to tenant accounts only.

## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
        `,
    })
    @ApiBodyExample(UpdateSubscription, {
        id: '8fbdf728-dd73-4003-8a6a-4434186c6391',
        tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
        value: 123123123,
    })
    @ApiResponseExample(
        'update',
        'update Subcription',
        {
            subscription: {
                id: '8fbdf728-dd73-4003-8a6a-4434186c6391',
                tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                value: 123123123,
                nextBilling: '2024-06-30T00:00:28.476Z',
                createdAt: '2024-05-21T17:10:24.679Z',
                updatedAt: '2024-05-21T17:47:26.493Z',
            },
        },
        '/api/tenant/subscription/update',
    )
    @ApiErrorResponses('/api/tenant/subscription/update', '/api/tenant/subscription/update', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'id should not be empty, id must be a UUID, tenantId should not be empty, tenantId must be a UUID, value must be a positive number, nextBilling must be a valid ISO 8601 date string',
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
                summary: 'Subcription not found',
                detail: 'Subcription not found',
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
    async updateSubscription(@Req() req: Request, @Body() updateData: UpdateSubscription) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantSubscriptionService.updateSubscription({
            user: userData,
            ...updateData,
        } as UpdateSubscriptionRequestDTO);
    }

    @Delete('delete/:id')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Delete one Subcription by Id`,
        details: `
## Description
Delete a Subcription by Id within a domain using an access token. This operation is restricted to tenant accounts only.

## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level and user-level permissions.
        `,
    })
    @ApiParamExamples([
        {
            name: 'id',
            description: 'ID of Subcription',
            example: '8fbdf728-dd73-4003-8a6a-4434186c6391',
            required: true,
        },
    ])
    @ApiResponseExample(
        'delete',
        'delete a Subcription by Id',
        {
            subscription: {
                id: '8fbdf728-dd73-4003-8a6a-4434186c6391',
                tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                value: 123123123,
                nextBilling: '2024-06-30T00:00:28.476Z',
                createdAt: '2024-05-21T17:10:24.679Z',
                updatedAt: '2024-05-21T17:47:26.493Z',
            },
        },
        '/api/tenant/subscription/delete/8fbdf728-dd73-4003-8a6a-4434186c6392',
    )
    @ApiErrorResponses(
        '/api/tenant/subscription/delete/:id',
        '/api/tenant/subscription/delete/8fbdf728-dd73-4003-8a6a-4434186c6392',
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
                    summary: 'Subcription not found',
                    detail: 'Subcription not found',
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
    async deleteSubscription(@Req() req: Request, @Param() data: DeleteSubscription) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantSubscriptionService.deleteSubscription({
            user: userData,
            ...data,
        } as DeleteSubscriptionRequestDTO);
    }
}
