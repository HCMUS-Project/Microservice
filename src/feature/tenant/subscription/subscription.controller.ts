import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
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
    CancelSubscription,
    CancelSubscriptionRequestDTO,
    CreateSubscription,
    CreateSubscriptionRequestDTO,
    FindAllSubscriptionByQuery,
    FindAllSubscriptionByQueryAdmin,
    FindAllSubscriptionByQueryAdminRequestDTO,
    FindAllSubscriptionByQueryRequestDTO,
    FindPlansRequestDTO,
    UpdateSubscriptionStageByAdmin,
    UpdateSubscriptionStageByAdminRequestDTO,
} from './subscription.dto';
import { StageTenant } from 'src/common/enums/stageTenant.enum';

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
        planName: 'SILVER',
    })
    @ApiResponseExample(
        'create',
        'create Subcription',
        {
            subscription: {
                id: 'd74d947a-e4e3-466f-b141-1795ff57153d',
                tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                totalValue: 1140000,
                stage: 'PENDING',
                plan: {
                    name: 'SILVER',
                    pricePerMonth: 190000,
                    limitOfMonth: 6,
                    limitOfServices: 10,
                    limitOfEmployees: 20,
                    limitOfProducts: 10,
                    feePercentPerTransaction: 0.03999999910593033,
                },
                nextBilling: '2024-12-25T12:08:14.355Z',
                createdAt: '2024-06-25T12:08:14.357Z',
                updatedAt: '2024-06-25T12:08:14.357Z',
            },
        },
        '/api/tenant/subscription/create',
    )
    @ApiErrorResponses('/api/tenant/subscription/create', '/api/tenant/subscription/create', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'tenantId should not be empty, tenantId must be a UUID, planName should not be empty, planName must be a string',
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
                summary: 'Existing subscription not cancelled',
                detail: 'Existing subscription not cancelled',
            },
            {
                key: 'plan_not_found',
                summary: 'Plan not found',
                detail: 'Plan not found',
            },
            {
                key: 'tenant_not_found',
                summary: 'Tenant not found',
                detail: 'Tenant not found',
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

    @Get('find/history')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `List history of subscription by Query`,
        details: `
## Description
List history of subscription by Query within a domain using an access token.
## Requirements
- **Access Token**: Must provide a valid access token.
- **tenantId**: Must provide id of tenant
- **stage**: Optional, if not, query all
`,
    })
    @ApiQueryExamples([
        {
            name: 'tenantId',
            description: 'ID of Tenant in DB',
            example: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
            required: true,
        },
        {
            name: 'stage',
            description: 'stage of tenant subscription',
            example: StageTenant.PENDING,
            required: false,
        },
    ])
    @ApiResponseExample(
        'read',
        'list history of subscription by Query',
        {
            subscriptions: [
                {
                    id: 'd74d947a-e4e3-466f-b141-1795ff57153d',
                    tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                    totalValue: 1140000,
                    stage: 'CANCELLED',
                    plan: {
                        name: 'SILVER',
                        pricePerMonth: 190000,
                        limitOfMonth: 6,
                        limitOfServices: 10,
                        limitOfEmployees: 20,
                        limitOfProducts: 10,
                        feePercentPerTransaction: 0.03999999910593033,
                    },
                    nextBilling: '2024-12-25T12:08:14.355Z',
                    createdAt: '2024-06-25T12:08:14.357Z',
                    updatedAt: '2024-06-25T12:12:57.201Z',
                },
            ],
        },
        '/api/tenant/subscription/find/history?tenantId=d4d98d4c-d2f4-4d91-a6e7-2555715ce144&stage=CANCELLED',
    )
    @ApiErrorResponses(
        '/api/tenant/subscription/find/history?tenantId=d4d98d4c-d2f4-4d91-a6e7-2555715ce14&stage=CANCELLE',
        '/api/tenant/subscription/find/history?tenantId=d4d98d4c-d2f4-4d91-a6e7-2555715ce144&stage=CANCELLED',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'Invalid stage: CANCELLE. Must be one of: PENDING, SUCCESS, FAILED, CANCELLED',
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
        },
    )
    async findAllSubscriptionByQuery(
        @Req() req: Request,
        @Query() data: FindAllSubscriptionByQuery,
    ) {
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
        return await this.tenantSubscriptionService.findAllSubscriptionByQuery({
            user: userData,
            ...data,
        } as FindAllSubscriptionByQueryRequestDTO);
    }

    @Get('find/admin')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-access-token-admin')
    @ApiEndpoint({
        summary: `List history of subscription of all Tenant by Query`,
        details: `
## Description
List history of subscription by Query of all Tenant within a domain using an access token.
## Requirements
- **Access Token**: Must provide a valid access token.
- If dont have any thing in query, query all
`,
    })
    @ApiQueryExamples([
        {
            name: 'domain',
            description: 'a valid domain',
            example: '30shine.com',
            required: false,
        },
        {
            name: 'stage',
            description: 'stage of tenant subscription',
            example: StageTenant.PENDING,
            required: false,
        },
        {
            name: 'planName',
            description: 'name of plan',
            example: 'PLAN1',
            required: false,
        },
    ])
    @ApiResponseExample(
        'read',
        'list history of subscription of all Tenant by Query',
        {
            subscriptions: [
                {
                    id: '8c331fbe-59dc-45ef-ad95-61b5243aafe9',
                    tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                    totalValue: 2160000,
                    stage: 'PENDING',
                    plan: {
                        name: 'GOLD',
                        pricePerMonth: 180000,
                        limitOfMonth: 12,
                        limitOfServices: 15,
                        limitOfEmployees: 30,
                        limitOfProducts: 15,
                        feePercentPerTransaction: 0.029999999329447746,
                    },
                    nextBilling: '2025-06-25T12:25:23.670Z',
                    createdAt: '2024-06-25T12:25:23.671Z',
                    updatedAt: '2024-06-25T12:25:23.671Z',
                },
            ],
        },
        '/api/tenant/subscription/find/admin?domain=30shine.com&stage=PENDING&planName=GOLD',
    )
    @ApiErrorResponses(
        '/api/tenant/subscription/find/admin?domain=30shinecom&stage=PENDIN&planName=GOLD',
        '/api/tenant/subscription/find/admin?domain=30shine.com&stage=PENDING&planName=GOLD',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'Invalid stage: PENDIN. Must be one of: PENDING, SUCCESS, FAILED, CANCELLED',
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
        },
    )
    async findAllSubscriptionByQueryAdmin(
        @Req() req: Request,
        @Query() data: FindAllSubscriptionByQueryAdmin,
    ) {
        // console.log(req, data);
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantSubscriptionService.findAllSubscriptionByQueryAdmin({
            user: userData,
            ...data,
        } as FindAllSubscriptionByQueryAdminRequestDTO);
    }

    @Get('find/plans')
    @ApiEndpoint({
        summary: `List all plans of Subscription`,
        details: `
## Description
List all plans of Subscription.
## Requirements
`,
    })
    @ApiResponseExample(
        'read',
        'list all plans of Subscription',
        {
            plans: [
                {
                    name: 'BRONZE',
                    pricePerMonth: 200000,
                    limitOfMonth: 3,
                    limitOfServices: 5,
                    limitOfEmployees: 10,
                    limitOfProducts: 5,
                    feePercentPerTransaction: 0.05000000074505806,
                },
                {
                    name: 'SILVER',
                    pricePerMonth: 190000,
                    limitOfMonth: 6,
                    limitOfServices: 10,
                    limitOfEmployees: 20,
                    limitOfProducts: 10,
                    feePercentPerTransaction: 0.03999999910593033,
                },
                {
                    name: 'GOLD',
                    pricePerMonth: 180000,
                    limitOfMonth: 12,
                    limitOfServices: 15,
                    limitOfEmployees: 30,
                    limitOfProducts: 15,
                    feePercentPerTransaction: 0.029999999329447746,
                },
            ],
        },
        '/api/tenant/subscription/find/plans',
    )
    async findPlans(@Req() req: Request, @Query() data: FindPlansRequestDTO) {
        // // console.log(data);
        // const payloadToken = req['user'];
        // // const header = req.headers;
        // const userData = {
        //     email: payloadToken.email,
        //     domain: payloadToken.domain,
        //     role: payloadToken.role,
        //     accessToken: payloadToken.accessToken,
        // } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantSubscriptionService.findPlans({
            ...data,
        } as FindPlansRequestDTO);
    }

    @Post('update/admin')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-access-token-admin')
    @ApiEndpoint({
        summary: `Update Stage of Subscription Tenant`,
        details: `
## Description
Update Stage of Subscription Tenant within a domain using an access token. This operation is restricted to tenant accounts only.

## Requirements
- **Access Token**: Must provide a valid admin access token.
- **Permissions**: Requires admin-level permissions.
`,
    })
    @ApiBodyExample(UpdateSubscriptionStageByAdmin, {
        id: '8c331fbe-59dc-45ef-ad95-61b5243aafe9',
        tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
        stage: 'SUCCESS',
    })
    @ApiResponseExample(
        'update',
        'update Subcription Stage by Admin',
        {
            subscription: {
                id: '8c331fbe-59dc-45ef-ad95-61b5243aafe9',
                tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                totalValue: 2160000,
                stage: 'SUCCESS',
                plan: {
                    name: 'GOLD',
                    pricePerMonth: 180000,
                    limitOfMonth: 12,
                    limitOfServices: 15,
                    limitOfEmployees: 30,
                    limitOfProducts: 15,
                    feePercentPerTransaction: 0.029999999329447746,
                },
                nextBilling: '2025-06-25T12:25:23.670Z',
                createdAt: '2024-06-25T12:25:23.671Z',
                updatedAt: '2024-06-25T16:56:16.760Z',
            },
        },
        '/api/tenant/subscription/update/admin',
    )
    @ApiErrorResponses(
        '/api/tenant/subscription/update/admin',
        '/api/tenant/subscription/update/admin',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'id should not be empty, id must be a UUID, tenantId should not be empty, tenantId must be a UUID, stage should not be empty',
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
                    summary: 'Subscription not found',
                    detail: 'Subscription not found',
                },
            ],
        },
    )
    async updateSubscriptionStageByAdmin(
        @Req() req: Request,
        @Body() updateData: UpdateSubscriptionStageByAdmin,
    ) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantSubscriptionService.updateSubscriptionStageByAdmin({
            user: userData,
            ...updateData,
        } as UpdateSubscriptionStageByAdminRequestDTO);
    }

    @Patch('cancel/:id')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Cancelled one Subcription by Tenant Id`,
        details: `
## Description
Cancelled one Subcription by Tenant Id within a domain using an access token. This operation is restricted to tenant accounts only.

## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level.
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
        'update',
        'cancel a Subcription by Id',
        {
            subscription: {
                id: '8c331fbe-59dc-45ef-ad95-61b5243aafe9',
                tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                totalValue: 2160000,
                stage: 'CANCELLED',
                plan: {
                    name: 'GOLD',
                    pricePerMonth: 180000,
                    limitOfMonth: 12,
                    limitOfServices: 15,
                    limitOfEmployees: 30,
                    limitOfProducts: 15,
                    feePercentPerTransaction: 0.029999999329447746,
                },
                nextBilling: '2025-06-25T12:25:23.670Z',
                createdAt: '2024-06-25T12:25:23.671Z',
                updatedAt: '2024-06-25T17:04:11.763Z',
            },
        },
        '/api/tenant/subscription/cancel/8c331fbe-59dc-45ef-ad95-61b5243aafe9',
    )
    @ApiErrorResponses(
        '/api/tenant/subscription/cancel/8c331fbe-59dc-45ef-ad95-61b5243aafe',
        '/api/tenant/subscription/cancel/8c331fbe-59dc-45ef-ad95-61b5243aafe9',
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
            ],
            forbidden: [
                {
                    key: 'forbidden_resource',
                    summary: 'Forbidden resource',
                    detail: 'Forbidden resource',
                },
                {
                    key: 'not_found',
                    summary: 'Subscription not found',
                    detail: 'Subscription not found',
                },
            ],
        },
    )
    async cancelSubscription(@Req() req: Request, @Param() data: CancelSubscription) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantSubscriptionService.cancelSubscription({
            user: userData,
            ...data,
        } as CancelSubscriptionRequestDTO);
    }
}
