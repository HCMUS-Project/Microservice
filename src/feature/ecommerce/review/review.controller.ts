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
    DeleteReview,
    DeleteReviewRequestDTO,
    FindAllReviewsRequestDTO,
    UpdateReview,
    UpdateReviewRequestDTO,
} from './review.dto';
import {
    ApiBodyExample,
    ApiEndpoint,
    ApiErrorResponses,
    ApiParamExamples,
    ApiQueryExamples,
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';

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
    @ApiEndpoint({
        summary: `Create Review`,
        details: `
## Description
Create within a domain using an access token. This operation is restricted to user accounts only.
        
## Requirements
- **Access Token**: Must provide a valid user access token.
- **Permissions**: Requires user-level permissions.
`,
    })
    @ApiBodyExample(CreateReview, {
        productId: 'c886a59c-7293-4239-8052-eb611b68e890',
        rating: 3.5,
        review: 'San pham nay nhin chung cung duoc, ko nen mua',
    })
    @ApiResponseExample(
        'create',
        'create Review',
        {
            review: {
                id: '68c1eea1-393a-4836-a01c-b7240f1adcbf',
                type: 'ecommerce',
                domain: '30shine.com',
                productId: 'c886a59c-7293-4239-8052-eb611b68e890',
                user: 'volehoai070902@gmail.com',
                rating: 3.5,
                review: 'San pham nay nhin chung cung duoc, ko nen mua',
                createdAt: '2024-05-17T08:39:13.922Z',
                updatedAt: '2024-05-17T08:39:13.922Z',
            },
        },
        '/api/ecommerce/review/create',
    )
    @ApiErrorResponses('/api/ecommerce/review/create', '/api/ecommerce/review/create', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'productId should not be empty, productId must be a UUID, rating should not be empty, rating must not be less than 0, rating must be a number conforming to the specified constraints, review should not be empty',
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
                key: 'not_purchased_product',
                summary: 'User has not purchased Product',
                detail: 'User has not purchased Product',
            },
        ],
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

    @Get('find')
    @ApiEndpoint({
        summary: `Find Reviews`,
        details: `
## Description
Return all Reviews within a domain.  
        
## Requirements 
- **domain** must be in query, default to query all reviews
- **pageSize** and **page** to limit result
- **Default** is 10 for **pageSize** and 1 for **page** without pass
`,
    })
    @ApiQueryExamples([
        {
            name: 'domain',
            description: 'domain to get review',
            example: '30shine.com',
            required: true,
        },
        {
            name: 'productId',
            description: 'Id of product want to get review',
            example: 'ebe267f1-2f6c-416b-ac24-d713838ea92f',
            required: false,
        },
        {
            name: 'pageSize',
            description: 'Number of review per page',
            example: 10,
            required: false,
        },
        {
            name: 'page',
            description: 'the order of page',
            example: 1,
            required: false,
        },
    ])
    @ApiResponseExample(
        'read',
        'find all Reviews',
        {
            reviews: [
                {
                    id: '2aa6a553-7baa-47d7-8ff0-b1c3c8f7ba8e',
                    type: 'ecommerce',
                    domain: '30shine.com',
                    productId: 'c886a59c-7293-4239-8052-eb611b68e890',
                    user: 'volehoai070902@gmail.com',
                    rating: 5,
                    review: 'Toi nghi lai roi',
                    createdAt: '2024-05-17T09:59:32.887Z',
                    updatedAt: '2024-05-17T10:21:53.443Z',
                },
            ],
            totalPages: 1,
            page: 1,
            pageSize: 10,
        },
        '/api/ecommerce/review/find/?productId=c886a59c-7293-4239-8052-eb611b68e890&pageSize=10&page=1&domain=30shine.com',
    )
    @ApiErrorResponses(
        '/api/ecommerce/review/find/?productId=&pageSize=&page=&domain=',
        '/api/ecommerce/review/find/?productId=c886a59c-7293-4239-8052-eb611b68e890&pageSize=10&page=1&domain=30shine.com',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'domain should not be empty, domain must be a URL address, productId must be a UUID, pageSize must not be less than 1, page must not be less than 1',
            }, 
        },
    )
    async findAllReviews(
        @Req() req: Request,
        @Query()
        query: FindAllReviewsRequestDTO,
    ) {
        // const payloadToken = req['user'];
        // // const header = req.headers;
        // const userData = {
        //     email: payloadToken.email,
        //     domain: payloadToken.domain,
        //     role: payloadToken.role,
        //     accessToken: payloadToken.accessToken,
        // } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceReviewService.findAllReviews({
            ...query,
        } as FindAllReviewsRequestDTO);
    }

    @Post('update')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.USER)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiEndpoint({
        summary: `Update a Review by Id of Review`,
        details: `
## Description
Update a Cart by Id of CartItem within a domain using an access token. This operation is restricted to user accounts only.
        
## Requirements
- **Access Token**: Must provide a valid user access token.
- **Permissions**: Requires user-level permissions.
`,
    })
    @ApiBodyExample(UpdateReview, {
        id: '2aa6a553-7baa-47d7-8ff0-b1c3c8f7ba8e',
        userId: 'volehoai070902@gmail.com',
        rating: 5,
        review: 'Toi nghi lai roi',
    })
    @ApiResponseExample(
        'update',
        'update a Review',
        {
            review: {
                id: '2aa6a553-7baa-47d7-8ff0-b1c3c8f7ba8e',
                type: 'ecommerce',
                domain: '30shine.com',
                productId: 'c886a59c-7293-4239-8052-eb611b68e890',
                user: 'volehoai070902@gmail.com',
                rating: 5,
                review: 'Toi nghi lai roi',
                createdAt: '2024-05-17T09:59:32.887Z',
                updatedAt: '2024-05-17T10:21:53.443Z',
            },
        },
        '/api/ecommerce/review/update',
    )
    @ApiErrorResponses('/api/ecommerce/review/update', '/api/ecommerce/review/update', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'id should not be empty, id must be a UUID, productId should not be empty, productId must be a UUID, userId should not be empty, rating should not be empty, rating must not be less than 0, rating must be an integer number, review should not be empty',
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
                key: 'review_not_found',
                summary: 'Review not found',
                detail: 'Review not found',
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
    @ApiEndpoint({
        summary: `Delete a Review by Id`,
        details: `
## Description
Delete a Review by Id within a domain using an access token. This operation is restricted to user accounts only.
        
## Requirements
- **Access Token**: Must provide a valid user access token.
- **Permissions**: Requires user-level permissions.
`,
    })
    @ApiParamExamples([
        {
            name: 'id',
            description: 'id of Review',
            example: 'id must be a UUID',
            required: true,
        },
    ])
    @ApiResponseExample(
        'delete',
        'delete a Review by Id',
        { result: 'success' },
        '/api/ecommerce/review/delete/968b2af1-3519-4493-8e20-f056e5c0f672 ',
    )
    @ApiErrorResponses(
        '/api/ecommerce/review/delete/:id',
        '/api/ecommerce/review/delete/fe06853b-8c7c-458c-b5f3-3a7571e11d5e',
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
                    key: 'review_not_found',
                    summary: 'Review not found',
                    detail: 'Review not found',
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
    async deleteReview(@Req() req: Request, @Param() data: DeleteReview) {
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
            ...data,
        } as DeleteReviewRequestDTO);
    }
}
