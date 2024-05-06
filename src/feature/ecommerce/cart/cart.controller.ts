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
import { EcommerceCartService } from './cart.service';
import { Roles } from 'src/common/decorator/role.decorator';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { RolesGuard } from 'src/common/guards/role/role.guard';
import { Role } from 'src/proto_build/auth/userToken/Role';
import {
    CreateCart,
    CreateCartRequestDTO,
    DeleteCartRequestDTO,
    FindAllCartsByUserIdRequestDTO,
    UpdateCart,
    UpdateCartRequestDTO,
} from './cart.dto';
import { UserDto } from 'src/feature/commonDTO/user.dto';

@Controller('/ecommerce/cart')
@ApiTags('ecommerce/cart')
export class CartController {
    constructor(
        @Inject('GRPC_ECOMMERCE_SERVICE_CART')
        private readonly ecommerceCartService: EcommerceCartService,
    ) {}

    @Post('create')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.USER)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiOperation({
        summary: 'Create cart of user in domain',
        description: `
## Use access token
## For user account
## Parse email to user_id `,
    })
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBody({
        type: CreateCart,
        examples: {
            category_1: {
                value: {
                    userId: 'khoi dep trai qua',
                    cartItems: [
                        {
                            quantity: 1,
                            productId: 'a83854d9-b3db-49b8-b5bc-5fac19042b91',
                        },
                        {
                            quantity: 5,
                            productId: 'ebe267f1-2f6c-416b-ac24-d713838ea92f',
                        },
                    ],
                } as CreateCart,
            },
        },
    })
    @ApiCreatedResponse({
        description: 'Create cart successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after Create voucher successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-05-06T08:50:30.349Z',
                            path: '/api/ecommerce/cart/create',
                            message: null,
                            error: null,
                            data: {
                                cart: {
                                    cartItems: [
                                        {
                                            productId: 'ebe267f1-2f6c-416b-ac24-d713838ea92f',
                                            quantity: 5,
                                        },
                                        {
                                            productId: 'a83854d9-b3db-49b8-b5bc-5fac19042b91',
                                            quantity: 1,
                                        },
                                    ],
                                    id: '072360d7-0504-42da-bcfa-666282d5ad76',
                                    totalPrice: 250,
                                    createdAt: '2024-05-06T08:50:30.336Z',
                                    updatedAt: '2024-05-06T08:50:30.336Z',
                                },
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
                            path: '/api/ecommerce/cart/create',
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
                            path: '/api/ecommerce/cart/create',
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
                            path: '/api/ecommerce/cart/create',
                            message: 'Access Token not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async createCart(@Req() req: Request, @Body() data: CreateCart) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceCartService.createCart({
            user: userData,
            ...data,
        } as CreateCartRequestDTO);
    }

    @Get('search')
    @ApiQuery({
        name: 'userId',
        description: 'Search by User Id',
        required: true,
        example: 'khoi dep trai qua',
    })
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Find all carts by User Id',
        description: `
## Use access token
## User user_id to search
## Can search by token of user and tenant`,
    })
    @ApiCreatedResponse({
        description: 'Get all carts successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after get all vouchers successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-06T09:03:46.888Z',
                            path: '/api/ecommerce/cart/search/?userId=khoi%20dep%20trai%20qua',
                            message: null,
                            error: null,
                            data: {
                                carts: [
                                    {
                                        cartItems: [
                                            {
                                                productId: 'ebe267f1-2f6c-416b-ac24-d713838ea92f',
                                                quantity: 5,
                                            },
                                            {
                                                productId: 'a83854d9-b3db-49b8-b5bc-5fac19042b91',
                                                quantity: 1,
                                            },
                                        ],
                                        id: '072360d7-0504-42da-bcfa-666282d5ad76',
                                        totalPrice: 250,
                                        createdAt: '2024-05-06T08:50:30.336Z',
                                        updatedAt: '2024-05-06T08:50:30.336Z',
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
    async findAllCartsByUserId(
        @Req() req: Request,
        @Query()
        query: {
            userId?: string;
        },
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
        return await this.ecommerceCartService.findAllCartsByUserId({
            user: userData,
            ...query,
        } as FindAllCartsByUserIdRequestDTO);
    }

    @Post('update')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.USER)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiOperation({
        summary: 'Update one cart',
        description: `
## Use access token
## Must be USER`,
    })
    @ApiBody({
        type: UpdateCart,
        examples: {
            category_1: {
                value: {
                    userId: 'khoi dep trai qua',
                    id: '072360d7-0504-42da-bcfa-666282d5ad76',
                    cartItems: [
                        {
                            quantity: 5,
                            productId: 'ebe267f1-2f6c-416b-ac24-d713838ea92f',
                        },
                    ],
                } as UpdateCart,
            },
        },
    })
    @ApiCreatedResponse({
        description: 'Update one voucher successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after update voucher successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-05-06T09:23:22.720Z',
                            path: '/api/ecommerce/cart/update',
                            message: null,
                            error: null,
                            data: {
                                cart: {
                                    cartItems: [
                                        {
                                            productId: 'ebe267f1-2f6c-416b-ac24-d713838ea92f',
                                            quantity: 5,
                                        },
                                    ],
                                    id: '072360d7-0504-42da-bcfa-666282d5ad76',
                                    totalPrice: 250,
                                    createdAt: '2024-05-06T08:50:30.336Z',
                                    updatedAt: '2024-05-06T09:23:22.696Z',
                                },
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
    async updateCart(@Req() req: Request, @Body() updateCart: UpdateCart) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceCartService.updateCart({
            user: userData,
            ...updateCart,
        } as UpdateCartRequestDTO);
    }

    @Delete('delete/:id')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.USER)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiOperation({
        summary: 'Delete one cart',
        description: `
## Use access token
## Must be USER`,
    })
    @ApiParam({
        name: 'id',
        description: 'ID of cart in DB',
        example: '072360d7-0504-42da-bcfa-666282d5ad76',
        required: true,
    })
    @ApiCreatedResponse({
        description: 'Delete one cart successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after delete cart successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-06T09:34:46.756Z',
                            path: '/api/ecommerce/cart/delete/072360d7-0504-42da-bcfa-666282d5ad76',
                            message: null,
                            error: null,
                            data: {
                                cart: {
                                    cartItems: [
                                        {
                                            productId: 'ebe267f1-2f6c-416b-ac24-d713838ea92f',
                                            quantity: 5,
                                        },
                                    ],
                                    id: '072360d7-0504-42da-bcfa-666282d5ad76',
                                    totalPrice: 250,
                                    createdAt: '2024-05-06T08:50:30.336Z',
                                    updatedAt: '2024-05-06T09:23:22.696Z',
                                },
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
    async deleteVoucher(@Req() req: Request, @Param('id') id: string) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceCartService.deleteCart({
            user: userData,
            id,
        } as DeleteCartRequestDTO);
    }
}
