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
import { EcommerceReviewService } from './review.service';
import {
    CreateReview,
    CreateReviewRequestDTO,
    DeleteReviewRequestDTO,
    FindAllReviews,
    FindAllReviewsRequestDTO,
    UpdateReview,
    UpdateReviewRequestDTO,
} from './review.dto';

@Controller('/ecommerce/review')
@ApiTags('ecommerce/review')
export class ReviewController {
    constructor(
        @Inject('GRPC_ECOMMERCE_SERVICE_REVIEW')
        private readonly ecommerceReviewService: EcommerceReviewService,
    ) {}

    @Post('create')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.USER)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiOperation({
        summary: 'Create review of user in domain',
        description: `
## Use access token
## For user account`,
    })
    @ApiBody({
        type: CreateReview,
        examples: {
            category_1: {
                value: {
                    productId: 'ebe267f1-2f6c-416b-ac24-d713838ea92f',
                    rating: 3.5,
                    review: 'San pham nay nhin chung cung duoc, ko nen mua',
                } as CreateReview,
            },
        },
    })
    @ApiCreatedResponse({
        description: 'Create review successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after Create review successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-05-07T05:34:41.213Z',
                            path: '/api/ecommerce/review/create',
                            message: null,
                            error: null,
                            data: {
                                review: {
                                    id: 'fe06853b-8c7c-458c-b5f3-3a7571e11d5e',
                                    domain: '30shine.com',
                                    productId: 'ebe267f1-2f6c-416b-ac24-d713838ea92f',
                                    user: 'volehoai070902@gmail.com',
                                    rating: 3.5,
                                    review: 'San pham nay nhin chung cung duoc, ko nen mua',
                                    createdAt: '2024-05-07T04:41:29.232Z',
                                    updatedAt: '2024-05-07T05:34:41.189Z',
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
                            path: '/api/ecommerce/review/create',
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
                            path: '/api/ecommerce/review/create',
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
                            path: '/api/ecommerce/review/create',
                            message: 'Access Token not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async createReview(@Req() req: Request, @Body() data: CreateReview) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceReviewService.createReview({
            user: userData,
            ...data,
        } as CreateReviewRequestDTO);
    }

    @Get('find/all')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Find all review by productId',
        description: `
## Use access token
## Use pageSize and page to limit result
## Default is 10 and 1 if not pass value in`,
    })
    @ApiQuery({
        name: 'productId',
        description: 'Id of product want to get review',
        required: false,
        example: 'ebe267f1-2f6c-416b-ac24-d713838ea92f',
    })
    @ApiQuery({
        name: 'pageSize',
        description: 'Number of review per page',
        required: false,
        example: 10,
    })
    @ApiQuery({
        name: 'page',
        description: 'the order of page',
        required: false,
        example: 1,
    })
    @ApiCreatedResponse({
        description: 'Get all reviews successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after get one order successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-07T05:39:56.138Z',
                            path: '/api/ecommerce/review/find/all/?productId=ebe267f1-2f6c-416b-ac24-d713838ea92f',
                            message: null,
                            error: null,
                            data: {
                                reviews: [
                                    {
                                        id: 'fe06853b-8c7c-458c-b5f3-3a7571e11d5e',
                                        domain: '30shine.com',
                                        productId: 'ebe267f1-2f6c-416b-ac24-d713838ea92f',
                                        user: 'volehoai070902@gmail.com',
                                        rating: 3.5,
                                        review: 'San pham nay nhin chung cung duoc, ko nen mua',
                                        createdAt: '2024-05-07T04:41:29.232Z',
                                        updatedAt: '2024-05-07T05:34:41.189Z',
                                    },
                                ],
                                totalPages: 1,
                                page: 1,
                                pageSize: 10,
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
    async findAllReviews(
        @Req() req: Request,
        @Query()
        query: FindAllReviews,
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
        return await this.ecommerceReviewService.findAllReviews({
            user: userData,
            ...query,
        } as FindAllReviewsRequestDTO);
    }

    @Post('update')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.USER)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiOperation({
        summary: 'Update Review',
        description: `
## Use access token
## Must be USER`,
    })
    @ApiBody({
        type: UpdateReview,
        examples: {
            category_1: {
                value: {
                    id: 'fe06853b-8c7c-458c-b5f3-3a7571e11d5e',
                    domain: '30shine.com',
                    productId: 'ebe267f1-2f6c-416b-ac24-d713838ea92f',
                    userId: 'volehoai070902@gmail.com',
                    rating: 5,
                    review: 'Toi nghi lai roi',
                } as UpdateReview,
            },
        },
    })
    @ApiCreatedResponse({
        description: 'Update one review successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after update review successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-05-07T06:00:47.990Z',
                            path: '/api/ecommerce/review/update',
                            message: null,
                            error: null,
                            data: {
                                review: {
                                    id: 'fe06853b-8c7c-458c-b5f3-3a7571e11d5e',
                                    domain: '30shine.com',
                                    productId: 'ebe267f1-2f6c-416b-ac24-d713838ea92f',
                                    user: 'volehoai070902@gmail.com',
                                    rating: 5,
                                    review: 'Toi nghi lai roi',
                                    createdAt: '2024-05-07T04:41:29.232Z',
                                    updatedAt: '2024-05-07T06:00:47.971Z',
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
                            path: '/api/ecommerce/review/update',
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
                            path: '/api/ecommerce/review/update',
                            message: 'Category not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async updateReview(@Req() req: Request, @Body() updateReview: UpdateReview) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceReviewService.updateReview({
            user: userData,
            ...updateReview,
        } as UpdateReviewRequestDTO);
    }

    @Delete('delete/:id')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.USER)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiOperation({
        summary: 'Delete one review',
        description: `
## Use access token
## USER role`,
    })
    @ApiParam({
        name: 'id',
        description: 'ID of review in DB',
        example: 'fe06853b-8c7c-458c-b5f3-3a7571e11d5e',
        required: true,
    })
    @ApiCreatedResponse({
        description: 'Cancel one review successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after delete one review successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-07T06:02:16.618Z',
                            path: '/api/ecommerce/review/delete/fe06853b-8c7c-458c-b5f3-3a7571e11d5e',
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
                            path: '/api/ecommerce/review/delete/fe06853b-8c7c-458c-b5f3-3a7571e11d5e',
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
                            path: '/api/ecommerce/review/delete/fe06853b-8c7c-458c-b5f3-3a7571e11d5e',
                            message: 'Category not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async deleteReview(@Req() req: Request, @Param('id') id: string) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceReviewService.deleteReview({
            user: userData,
            id,
        } as DeleteReviewRequestDTO);
    }
}
