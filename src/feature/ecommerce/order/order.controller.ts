import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Inject,
    UseGuards,
    Req,
    Query,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/role.decorator';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { RolesGuard } from 'src/common/guards/role/role.guard';
import { Role } from 'src/proto_build/auth/userToken/Role';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { EcommerceOrderService } from './order.service';
import {
    CancelOrder,
    CancelOrderRequestDTO,
    CreateOrder,
    CreateOrderRequestDTO,
    GetAllOrderValue,
    GetAllOrderValueRequestDTO,
    GetOrder,
    GetOrderRequestDTO,
    ListOrders,
    ListOrdersForTenant,
    ListOrdersForTenantRequestDTO,
    ListOrdersRequestDTO,
    UpdateStageOrder,
    UpdateStageOrderRequestDTO,
} from './order.dto';
import { StageOrder } from 'src/common/enums/stageOrder.enum';
import {
    ApiBodyExample,
    ApiEndpoint,
    ApiErrorResponses,
    ApiParamExamples,
    ApiQueryExamples,
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';

@Controller('/ecommerce/order')
@ApiTags('ecommerce/order')
export class OrderController {
    constructor(
        @Inject('GRPC_ECOMMERCE_SERVICE_ORDER')
        private readonly ecommerceOrderService: EcommerceOrderService,
    ) {}

    @Post('create')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.USER)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiEndpoint({
        summary: `Create an Order`,
        details: `
## Description
Create an Order within a domain using an access token. This operation is restricted to user accounts only.
        
## Requirements
- **Access Token**: Must provide a valid user access token.
- **Permissions**: Requires user-level permissions.
`,
    })
    @ApiBodyExample(CreateOrder, {
        productsId: [
            'c886a59c-7293-4239-8052-eb611b68e890',
            'f9e75324-a8f4-4cbd-af6d-0210c5e9a5d9',
        ],
        quantities: [3, 5],
        phone: '+84912345678',
        address: '123 abc, def, gh',
        voucherId: '384589ac-108a-4972-bbed-49771df4c7cb',
    })
    @ApiResponseExample(
        'create',
        'create an Order',
        { orderId: '65506ee4-5dc5-40d3-a1a7-9481b48c1cbc' },
        '/api/ecommerce/order/create',
    )
    @ApiErrorResponses('/api/ecommerce/order/create', '/api/ecommerce/order/create', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'productsId should not be empty, each value in productsId must be a UUID, productsId must be an array, each value in quantities must be a number conforming to the specified constraints, each value in quantities must not be less than 1, quantities should not be empty, quantities must be an array, phone should not be empty, Must be VietNam Phone Number (+84912345678), address should not be empty, voucherId must be a UUID',
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
                key: 'voucher_not_found',
                summary: 'Voucher not found',
                detail: 'Voucher not found',
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
                key: 'product_out_of_stock',
                summary: 'Product out of stock',
                detail: 'Product out of stock',
            },
            {
                key: 'voucher_expired',
                summary: 'Voucher expired',
                detail: 'Voucher expired',
            },
        ],
    })
    async createOrder(@Req() req: Request, @Body() data: CreateOrder) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceOrderService.creatOrder({
            user: userData,
            domain: userData.domain,
            ...data,
        } as CreateOrderRequestDTO);
    }

    @Get('find/:orderId')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Find an Order by OrderId`,
        details: `
## Description
Find an Order by OrderId within a domain using an access token.
        
## Requirements
- **Access Token**: Must provide a valid access token.
`,
    })
    @ApiParamExamples([
        {
            name: 'orderId',
            description: 'Id of Order',
            example: '4a8e7860-2320-4615-8917-3b283f9e488a',
            required: true,
        },
    ])
    @ApiResponseExample(
        'read',
        'find an Order by OrderId',
        {
            products: [
                {
                    productId: 'f9e75324-a8f4-4cbd-af6d-0210c5e9a5d9',
                    quantity: 5,
                },
                {
                    productId: 'c886a59c-7293-4239-8052-eb611b68e890',
                    quantity: 3,
                },
            ],
            orderId: '4a8e7860-2320-4615-8917-3b283f9e488a',
            phone: '+84912345678',
            address: '123 abc, def, gh',
            voucherId: '384589ac-108a-4972-bbed-49771df4c7cb',
            stage: 'pending',
        },
        '/api/ecommerce/order/find/4a8e7860-2320-4615-8917-3b283f9e488a',
    )
    @ApiErrorResponses(
        '/api/ecommerce/order/find/:orderId',
        '/api/ecommerce/order/find/4a8e7860-2320-4615-8917-3b283f9e488a',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'orderId must be a UUID',
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
                    summary: 'Order not found',
                    detail: 'Order not found',
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
    async getOrder(@Req() req: Request, @Param() param: GetOrder) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceOrderService.getOrder({
            user: userData,
            ...param,
        } as GetOrderRequestDTO);
    }

    @Get('search')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.USER)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiEndpoint({
        summary: `List all Orders of User by Query with: Stage`,
        details: `
## Description
Find all Orders by Query within a domain using an access token. This operation is restricted to user accounts only.
        
## Requirements
- **Access Token**: Must provide a valid user access token.
- **Permissions**: Requires user-level permissions.
- **stage**: Must is a valid stage
- **default**: without no query, list all orders of User
`,
    })
    @ApiQueryExamples([
        {
            name: 'stage',
            description: 'Search all request Order of User by stage',
            example: 'pending',
            required: true,
        },
    ])
    @ApiResponseExample(
        'read',
        'find all Orders of User by Stage',
        {
            orders: [
                {
                    products: [
                        {
                            productId: 'f9e75324-a8f4-4cbd-af6d-0210c5e9a5d9',
                            quantity: 5,
                        },
                        {
                            productId: 'c886a59c-7293-4239-8052-eb611b68e890',
                            quantity: 3,
                        },
                    ],
                    orderId: '4a8e7860-2320-4615-8917-3b283f9e488a',
                    phone: '+84912345678',
                    address: '123 abc, def, gh',
                    voucherId: '384589ac-108a-4972-bbed-49771df4c7cb',
                    stage: 'pending',
                },
            ],
        },
        '/api/ecommerce/order/search/?stage=pending',
    )
    @ApiErrorResponses(
        '/api/ecommerce/order/search/?stage=',
        '/api/ecommerce/order/search/?stage=pending',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'Must be a valid stage: pending, shipping, completed, CANCELLED',
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
    async listOrders(
        @Req() req: Request,
        @Query()
        query: ListOrders,
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
        return await this.ecommerceOrderService.listOrders({
            user: userData,
            ...query,
        } as ListOrdersRequestDTO);
    }

    @Get('tenant/search')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `List all Orders of Tenant by Query with: Stage`,
        details: `
## Description
Find all Orders by Query within a domain using an access token. This operation is restricted to user accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
- **stage**: Must is a valid stage
- **default**: without no query, list all orders of User
`,
    })
    @ApiQueryExamples([
        {
            name: 'stage',
            description: 'Search all Orders of domain by stage',
            example: 'pending',
            required: true,
        },
    ])
    @ApiResponseExample(
        'read',
        'find all Orders of Domain by Stage',
        {
            orders: [
                {
                    products: [
                        {
                            productId: 'f9e75324-a8f4-4cbd-af6d-0210c5e9a5d9',
                            quantity: 5,
                        },
                        {
                            productId: 'c886a59c-7293-4239-8052-eb611b68e890',
                            quantity: 3,
                        },
                    ],
                    orderId: '4ccce500-26ca-4cd7-957d-bb6ebb8653ba',
                    phone: '+84912345678',
                    address: '123 abc, def, gh',
                    voucherId: '384589ac-108a-4972-bbed-49771df4c7cb',
                    stage: 'pending',
                    user: 'volehoai070902@gmail.com',
                },
            ],
        },
        '/api/ecommerce/order/tenant/search/?stage=pending',
    )
    @ApiErrorResponses(
        '/api/ecommerce/order/tenant/search/?stage=',
        '/api/ecommerce/order/tenant/search/?stage=pending',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'Must be a valid stage: pending, shipping, completed, CANCELLED',
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
    async listOrdersForTenant(
        @Req() req: Request,
        @Query()
        query: ListOrdersForTenant,
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
        return await this.ecommerceOrderService.listOrdersForTenant({
            user: userData,
            ...query,
        } as ListOrdersForTenantRequestDTO);
    }

    @Get('tenant/report')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Get Report of User in Tenant`,
        details: `
## Description
Find all Orders of User for Tenant to visualize by Query within a domain using an access token. This operation is restricted to user accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
- **type**: Must is a valid type 
`,
    })
    @ApiQueryExamples([
        {
            name: 'type',
            description: 'Get Report of User in Tenant by type',
            example: 'YEAR',
            required: true,
        },
    ])
    @ApiResponseExample(
        'read',
        'find all Orders of User in Domain by type date',
        {
            report: [
                {
                    type: 'June',
                    totalOrder: 1,
                    totalValue: 400000,
                },
            ],
            value: 400000,
            total: 1,
        },
        '/api/ecommerce/order/tenant/report/?type=YEAR',
    )
    @ApiErrorResponses(
        '/api/ecommerce/order/tenant/report/',
        '/api/ecommerce/order/tenant/report/?type=YEAR',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'type should not be empty, Must be a valid Order Type: WEEK, YEAR, type must be a string',
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
    async getAllOrderValue(
        @Req() req: Request,
        @Query()
        query: GetAllOrderValue,
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
        return await this.ecommerceOrderService.getAllOrderValue({
            user: userData,
            ...query,
        } as GetAllOrderValueRequestDTO);
    }

    @Post('update/stage')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Update stage of an Order`,
        details: `
## Description
Update an Order stage within a domain using an access token. This operation is restricted to tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
`,
    })
    @ApiBodyExample(UpdateStageOrder, {
        orderId: '4a8e7860-2320-4615-8917-3b283f9e488a',
        stage: 'shipping',
    })
    @ApiResponseExample(
        'update',
        'update Order stage',
        { orderId: '4a8e7860-2320-4615-8917-3b283f9e488a', stage: 'shipping' },
        '/api/ecommerce/order/update/stage',
    )
    @ApiErrorResponses('/api/ecommerce/order/update/stage', '/api/ecommerce/order/update/stage', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'Must be a valid stage: pending, shipping, completed, cancelled, orderId should not be empty, orderId must be a UUID',
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
                key: 'order_not_found',
                summary: 'Order not found',
                detail: 'Order not found',
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
                key: 'invalid_argument',
                summary: 'Invalid argument stage',
                detail: 'Invalid argument stage',
            },
        ],
    })
    async updateStageOrder(@Req() req: Request, @Body() updateStage: UpdateStageOrder) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceOrderService.updateStageOrder({
            user: userData,
            ...updateStage,
        } as UpdateStageOrderRequestDTO);
    }

    @Patch('cancel/:id')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Change Stage of an Order to CANCELLED`,
        details: `
## Description
Change Stage of an Order to CANCELLED within a domain using an access token.
        
## Requirements
- **Access Token**: Must provide a valid access token. 
`,
    })
    @ApiParamExamples([
        {
            name: 'id',
            description: 'id of Order',
            example: '4a8e7860-2320-4615-8917-3b283f9e488a',
            required: true,
        },
    ])
    @ApiResponseExample(
        'update',
        'update an Order stage to Cancelled by pass Id',
        {
            result: 'success',
        },
        '/api/ecommerce/order/cancel/4a8e7860-2320-4615-8917-3b283f9e488a',
    )
    @ApiErrorResponses(
        '/api/ecommerce/order/cancel/:id',
        '/api/ecommerce/order/cancel/4a8e7860-2320-4615-8917-3b283f9e488a',
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
                    key: 'order_not_found',
                    summary: 'Order not found',
                    detail: 'Order not found',
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
                    key: 'order_already_cancelled',
                    summary: 'Order already cancelled',
                    detail: 'Order already cancelled',
                },
                {
                    key: 'pending_cant_cancelled',
                    summary: 'Stage cant cancelled by User',
                    detail: 'Stage Order different pending can not cancelled by User',
                },
            ],
        },
    )
    async cancelOrder(@Req() req: Request, @Param() data: CancelOrder) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceOrderService.cancelOrder({
            user: userData,
            ...data,
        } as CancelOrderRequestDTO);
    }
}
