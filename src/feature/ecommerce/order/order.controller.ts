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
    CancelOrderRequestDTO,
    CreateOrder,
    CreateOrderRequestDTO,
    GetOrderRequestDTO,
    ListOrders,
    ListOrdersRequestDTO,
    UpdateStageOrder,
    UpdateStageOrderRequestDTO,
} from './order.dto';
import { StageOrder } from 'src/common/enums/stageOrder.enum';

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
    @ApiOperation({
        summary: 'Create order of user in domain',
        description: `
## Use access token
## For user account
## Parse email to user_id `,
    })
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBody({
        type: CreateOrder,
        examples: {
            category_1: {
                value: {
                    domain: '30shine.com',
                    productsId: [
                        'ebe267f1-2f6c-416b-ac24-d713838ea92f',
                        'a83854d9-b3db-49b8-b5bc-5fac19042b91',
                    ],
                    quantities: [3, 5],
                    phone: '+84912345678',
                    address: '123 abc, def, gh',
                    voucherId: '3bb423de-2b81-4526-a1d3-9c3ca84633df',
                } as CreateOrder,
            },
        },
    })
    @ApiCreatedResponse({
        description: 'Create order successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after Create order successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-05-06T17:50:16.435Z',
                            path: '/api/ecommerce/order/create',
                            message: null,
                            error: null,
                            data: {
                                orderId: 'cd61a9d1-fcca-460c-875b-39e543fea679',
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Authorization failed',
        content: {
            'application/json': {
                examples: {
                    token_not_verified: {
                        summary: 'Token not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-27T12:31:30.700Z',
                            path: '/api/ecommerce/order/create',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                    unauthorized_role: {
                        summary: 'Role not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-27T12:31:30.700Z',
                            path: '/api/ecommerce/order/create',
                            message: 'Unauthorized Role',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                    token_not_found: {
                        summary: 'Token not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-02T10:55:28.511Z',
                            path: '/api/ecommerce/order/create',
                            message: 'Access Token not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
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
            ...data,
        } as CreateOrderRequestDTO);
    }

    @Get('find/:orderId')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Find one order by ID',
        description: `
## Use access token
## Use orderId to path`,
    })
    @ApiParam({
        name: 'orderId',
        description: 'ID of the order',
        example: 'cd61a9d1-fcca-460c-875b-39e543fea679',
        required: true,
    })
    @ApiCreatedResponse({
        description: 'Get one order successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after get one order successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-06T17:58:07.050Z',
                            path: '/api/ecommerce/order/find/cd61a9d1-fcca-460c-875b-39e543fea679',
                            message: null,
                            error: null,
                            data: {
                                products: [
                                    {
                                        productId: 'a83854d9-b3db-49b8-b5bc-5fac19042b91',
                                        quantity: 5,
                                    },
                                    {
                                        productId: 'ebe267f1-2f6c-416b-ac24-d713838ea92f',
                                        quantity: 3,
                                    },
                                ],
                                orderId: 'cd61a9d1-fcca-460c-875b-39e543fea679',
                                phone: '+84912345678',
                                address: '123 abc, def, gh',
                                voucherId: '3bb423de-2b81-4526-a1d3-9c3ca84633df',
                                stage: 'pending',
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Authorization failed',
        content: {
            'application/json': {
                examples: {
                    token_not_verified: {
                        summary: 'Token not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-27T17:42:40.039Z',
                            path: '/api/ecommerce/order/find/cd61a9d1-fcca-460c-875b-39e543fea679',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                    category_not_found: {
                        summary: 'Category not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-02T11:43:05.882Z',
                            path: '/api/ecommerce/order/find/cd61a9d1-fcca-460c-875b-39e543fea679',
                            message: 'Category not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async getOrder(@Req() req: Request, @Param('orderId') orderId: string) {
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
            orderId,
        } as GetOrderRequestDTO);
    }

    @Get('search')
    @ApiQuery({
        name: 'stage',
        description: 'Search all request Order by stage',
        required: true,
        example: 'pending',
    })
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Find all Order by stage',
        description: `
## Use access token
## User query 'stage' to search
## Can search by token of user and tenant`,
    })
    @ApiCreatedResponse({
        description: 'Get all orders by stage successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after get all orders by stage successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-06T18:36:24.256Z',
                            path: '/api/ecommerce/order/search/?stage=shipping',
                            message: null,
                            error: null,
                            data: {
                                orders: [
                                    {
                                        products: [
                                            {
                                                productId: 'a83854d9-b3db-49b8-b5bc-5fac19042b91',
                                                quantity: 5,
                                            },
                                            {
                                                productId: 'ebe267f1-2f6c-416b-ac24-d713838ea92f',
                                                quantity: 3,
                                            },
                                        ],
                                        orderId: 'cd61a9d1-fcca-460c-875b-39e543fea679',
                                        phone: '+84912345678',
                                        address: '123 abc, def, gh',
                                        voucherId: '3bb423de-2b81-4526-a1d3-9c3ca84633df',
                                        stage: 'shipping',
                                    },
                                ],
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Authorization failed',
        content: {
            'application/json': {
                examples: {
                    token_not_verified: {
                        summary: 'Token not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-02T11:30:43.976Z',
                            path: '/api/ecommerce/cart/search/?userId=khoi%20dep%20trai%20qua',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                },
            },
        },
    })
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

    @Post('update/stage')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Update stage of Order',
        description: `
## Use access token
## Must be TENANT`,
    })
    @ApiBody({
        type: UpdateStageOrder,
        examples: {
            category_1: {
                value: {
                    orderId: 'cd61a9d1-fcca-460c-875b-39e543fea679',
                    stage: StageOrder.CANCELLED,
                } as UpdateStageOrder,
            },
        },
    })
    @ApiCreatedResponse({
        description: 'Update one order successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after update order successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-05-06T18:50:43.731Z',
                            path: '/api/ecommerce/order/update/stage',
                            message: null,
                            error: null,
                            data: {
                                orderId: 'cd61a9d1-fcca-460c-875b-39e543fea679',
                                stage: 'cancelled',
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Authorization failed',
        content: {
            'application/json': {
                examples: {
                    token_not_verified: {
                        summary: 'Token not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-27T17:42:40.039Z',
                            path: '/api/ecommerce/order/update',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                    category_not_found: {
                        summary: 'Category not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-02T11:43:05.882Z',
                            path: '/api/ecommerce/order/update',
                            message: 'Category not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
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
    // @UseGuards(AccessTokenGuard, RolesGuard)
    // @Roles(Role.USER)
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Cancel one order',
        description: `
## Use access token
## USER and TENANT`,
    })
    @ApiParam({
        name: 'id',
        description: 'ID of order in DB',
        example: '072360d7-0504-42da-bcfa-666282d5ad76',
        required: true,
    })
    @ApiCreatedResponse({
        description: 'Cancel one order successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after cancel order successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-06T19:18:18.672Z',
                            path: '/api/ecommerce/order/cancel/cd61a9d1-fcca-460c-875b-39e543fea679',
                            message: null,
                            error: null,
                            data: {
                                result: 'success',
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Authorization failed',
        content: {
            'application/json': {
                examples: {
                    token_not_verified: {
                        summary: 'Token not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-27T17:42:40.039Z',
                            path: '/api/ecommerce/category/update',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                    category_not_found: {
                        summary: 'Category not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-02T11:43:05.882Z',
                            path: '/api/ecommerce/category/update',
                            message: 'Category not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async cancelOrder(@Req() req: Request, @Param('id') id: string) {
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
            id,
        } as CancelOrderRequestDTO);
    }
}
