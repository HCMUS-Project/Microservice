import { Controller, Get, Post, Body, Param, Delete, Inject, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EcommerceCartService } from './cart.service';
import { Roles } from 'src/common/decorator/role.decorator';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { RolesGuard } from 'src/common/guards/role/role.guard';
import { Role } from 'src/proto_build/auth/userToken/Role';
import {
    AddItemsToCart,
    AddItemsToCartRequestDTO,
    DeleteCart,
    DeleteCartRequestDTO,
    FindAllCartsByUserIdRequestDTO,
    UpdateCart,
    UpdateCartRequestDTO,
} from './cart.dto';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import {
    ApiBodyExample,
    ApiEndpoint,
    ApiErrorResponses,
    ApiParamExamples,
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';

@Controller('/ecommerce/cart')
@ApiTags('ecommerce/cart')
export class CartController {
    constructor(
        @Inject('GRPC_ECOMMERCE_SERVICE_CART')
        private readonly ecommerceCartService: EcommerceCartService,
    ) {}

    @Post('item/add')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.USER)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiEndpoint({
        summary: `Add an Item to Cart`,
        details: `
## Description
Add an Item to Cart within a domain using an access token. If Cart isnt exists, new Cart will be created; otherwise, add it to existed Cart. This operation is restricted to user accounts only.
        
## Requirements
- **Access Token**: Must provide a valid user access token.
- **Permissions**: Requires user-level permissions.
`,
    })
    @ApiBodyExample(AddItemsToCart, {
        userId: 'some userId',
        cartItem: {
            productId: 'c886a59c-7293-4239-8052-eb611b68e890',
            quantity: 2,
        },
    })
    @ApiResponseExample(
        'create',
        'add an Item to Cart',
        {
            cart: {
                cartItems: [
                    {
                        productId: 'c886a59c-7293-4239-8052-eb611b68e890',
                        quantity: 2,
                    },
                ],
                id: '7795a3bc-6468-4b77-9908-3fb766f74c08',
                createdAt: '2024-05-16T05:30:48.227Z',
                updatedAt: '2024-05-16T05:30:48.227Z',
            },
        },
        '/api/ecommerce/cart/item/add',
    )
    @ApiErrorResponses('/api/ecommerce/cart/item/add', '/api/ecommerce/cart/item/add', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'userId should not be empty, cartItem.productId should not be empty, cartItem.productId must be a UUID, cartItem.quantity must not be less than 1, cartItem.quantity must be an integer number',
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
                key: 'product_not_enough',
                summary: 'Product not enough',
                detail: 'Product not enough',
            },
        ],
    })
    async addItemToCart(@Req() req: Request, @Body() data: AddItemsToCart) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceCartService.addItemsToCart({
            user: userData,
            ...data,
        } as AddItemsToCartRequestDTO);
    }

    @Get('find/all')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Find all Carts by token`,
        details: `
## Description
Return all Carts within a domain using an access token.  
        
## Requirements
- **Access Token**: Must provide a valid access token. 
`,
    })
    @ApiResponseExample(
        'read',
        'find all Carts by UserId',
        {
            carts: [
                {
                    cartItems: [
                        {
                            productId: 'c886a59c-7293-4239-8052-eb611b68e890',
                            quantity: 2,
                        },
                        {
                            productId: 'f9e75324-a8f4-4cbd-af6d-0210c5e9a5d9',
                            quantity: 2,
                        },
                    ],
                    id: '7795a3bc-6468-4b77-9908-3fb766f74c08',
                    createdAt: '2024-05-16T05:30:48.227Z',
                    updatedAt: '2024-05-16T05:30:48.227Z',
                },
            ],
        },
        '/api/ecommerce/category/find/all',
    )
    @ApiErrorResponses('/api/ecommerce/category/find/all', '/api/ecommerce/category/find/all', {
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
                key: 'cart_not_found',
                summary: 'Cart not found',
                detail: 'Cart not found',
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
    async findAllCartsByUserId(@Req() req: Request) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(param)
        return await this.ecommerceCartService.findAllCartsByUserId({
            user: userData,
        } as FindAllCartsByUserIdRequestDTO);
    }

    @Post('update')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.USER)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiEndpoint({
        summary: `Update a Cart by Id of CartItem`,
        details: `
## Description
Update a Cart by Id of CartItem within a domain using an access token. This operation is restricted to user accounts only.
        
## Requirements
- **Access Token**: Must provide a valid user access token.
- **Permissions**: Requires user-level permissions.
`,
    })
    @ApiBodyExample(UpdateCart, {
        id: '7795a3bc-6468-4b77-9908-3fb766f74c08',
        cartItems: {
            quantity: 5,
            productId: 'c886a59c-7293-4239-8052-eb611b68e890',
        },
    })
    @ApiResponseExample(
        'update',
        'update an Item in Cart',
        {
            cart: {
                cartItems: [
                    {
                        productId: 'c886a59c-7293-4239-8052-eb611b68e890',
                        quantity: 5,
                    },
                    {
                        productId: 'f9e75324-a8f4-4cbd-af6d-0210c5e9a5d9',
                        quantity: 2,
                    },
                ],
                id: '7795a3bc-6468-4b77-9908-3fb766f74c08',
                createdAt: '2024-05-16T05:30:48.227Z',
                updatedAt: '2024-05-16T05:30:48.227Z',
            },
        },
        '/api/ecommerce/cart/update',
    )
    @ApiErrorResponses('/api/ecommerce/cart/update', '/api/ecommerce/cart/update', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'id should not be empty, id must be a UUID, cartItems.productId should not be empty, cartItems.productId must be a UUID, cartItems.quantity must not be less than 1, cartItems.quantity must be an integer number',
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
                key: 'cart_item_not_found',
                summary: 'Cart item not found',
                detail: 'Cart item not found',
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
                key: 'product_not_enough',
                summary: 'Product not enough',
                detail: 'Product Sách dạy làm giàu not enough',
            },
        ],
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
    @ApiEndpoint({
        summary: `Delete a Cart by Id`,
        details: `
## Description
Update a Cart by Id of CartItem within a domain using an access token. This operation is restricted to user accounts only.
        
## Requirements
- **Access Token**: Must provide a valid user access token.
- **Permissions**: Requires user-level permissions.
`,
    })
    @ApiParamExamples([
        {
            name: 'id',
            description: 'id of Cart',
            example: '7795a3bc-6468-4b77-9908-3fb766f74c08',
            required: true,
        },
    ])
    @ApiResponseExample(
        'delete',
        'delete a Cart by Id',
        {
            cart: {
                cartItems: [
                    {
                        productId: 'c886a59c-7293-4239-8052-eb611b68e890',
                        quantity: 5,
                    },
                    {
                        productId: 'f9e75324-a8f4-4cbd-af6d-0210c5e9a5d9',
                        quantity: 2,
                    },
                ],
                id: '7795a3bc-6468-4b77-9908-3fb766f74c08',
                createdAt: '2024-05-16T05:30:48.227Z',
                updatedAt: '2024-05-16T05:30:48.227Z',
            },
        },
        '/api/ecommerce/cart/delete/7795a3bc-6468-4b77-9908-3fb766f74c08',
    )
    @ApiErrorResponses(
        '/api/ecommerce/cart/delete/:id',
        '/api/ecommerce/cart/delete/7795a3bc-6468-4b77-9908-3fb766f74c09',
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
                    key: 'cart_not_found',
                    summary: 'Cart not found',
                    detail: 'Cart not found',
                    error: 'Unauthorized',
                },
            ],
            forbidden:[
                {
                    key: 'forbidden_resource',
                    summary: 'Forbidden resource',
                    detail: 'Forbidden resource',
                },
            ]
        },
    )
    async deleteCart(@Req() req: Request, @Param() data: DeleteCart) {
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
            ...data,
        } as DeleteCartRequestDTO);
    }
}
