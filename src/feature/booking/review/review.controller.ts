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
import { BookingReviewService } from './review.service';

@Controller('/booking/review')
@ApiTags('booking/review')
export class ReviewController {
    constructor(
        @Inject('GRPC_ECOMMERCE_BOOKING_REVIEW')
        private readonly bookingReviewService: BookingReviewService,
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
        serviceId: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
        review: 'cắt đẹp',
        rating: 4,
    })
    @ApiResponseExample(
        'create',
        'create Review',
        {
            review: {
                id: 'f51af79d-b9a8-4f0d-ae9a-b97f0e4e16a2',
                type: 'booking',
                serviceId: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
                user: 'volehoai070902@gmail.com',
                rating: 4,
                review: 'cắt đẹp',
                createdAt: '2024-05-31T11:21:29.813Z',
                updatedAt: '2024-05-31T11:21:29.813Z',
            },
        },
        '/api/booking/review/create',
    )
    @ApiErrorResponses('/api/booking/review/create', '/api/booking/review/create', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'serviceId should not be empty, serviceId must be a UUID, review should not be empty, review must be a string, rating should not be empty, rating must be a number conforming to the specified constraints',
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
        return await this.bookingReviewService.createReview({
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
            description: 'domain want to get review',
            example: '30shine.com',
            required: true,
        },
        {
            name: 'serviceId',
            description: 'Id of Service want to get review',
            example: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
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
                    id: 'f51af79d-b9a8-4f0d-ae9a-b97f0e4e16a2',
                    type: 'booking',
                    serviceId: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
                    user: 'volehoai070902@gmail.com',
                    rating: 4,
                    review: 'cắt đẹp',
                    createdAt: '2024-05-31T11:21:29.813Z',
                    updatedAt: '2024-05-31T11:22:24.315Z',
                },
            ],
            totalPages: 1,
            page: 1,
            pageSize: 10,
        },
        '/api/booking/review/find?serviceId=c2a4917c-b3ab-4ebf-aac3-563ab102e671&domain=30shine.com',
    )
    @ApiErrorResponses(
        '/api/booking/review/find?serviceId=c2a4917c-b3ab-4ebf-aac3-563ab102e671&domain=30shine.com',
        '/api/booking/review/find?serviceId=c2a4917c-b3ab-4ebf-aac3-563ab102e671&domain=30shine.com',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'property serviceId should not exist, pageSize must not be less than 1, page must not be less than 1, domain should not be empty, domain must be a URL address',
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
        return await this.bookingReviewService.findAllReviews({
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
Update a Review by Id of Review within a domain using an access token. This operation is restricted to user accounts only.
        
## Requirements
- **Access Token**: Must provide a valid user access token.
- **Permissions**: Requires user-level permissions.
`,
    })
    @ApiBodyExample(UpdateReview, { id: 'f51af79d-b9a8-4f0d-ae9a-b97f0e4e16a2', rating: 3 })
    @ApiResponseExample(
        'update',
        'update a Review',
        {
            review: {
                id: 'f51af79d-b9a8-4f0d-ae9a-b97f0e4e16a2',
                type: 'booking',
                serviceId: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
                user: 'volehoai070902@gmail.com',
                rating: 3,
                review: 'cắt đẹp',
                createdAt: '2024-05-31T11:21:29.813Z',
                updatedAt: '2024-05-31T12:05:32.442Z',
            },
        },
        '/api/booking/review/update',
    )
    @ApiErrorResponses('/api/booking/review/update', '/api/booking/review/update', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'id should not be empty, id must be a UUID',
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
                key: 'review_not_found',
                summary: 'Review not found',
                detail: 'Review not found',
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
        return await this.bookingReviewService.updateReview({
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
            example: 'f51af79d-b9a8-4f0d-ae9a-b97f0e4e16a2',
            required: true,
        },
    ])
    @ApiResponseExample(
        'delete',
        'delete a Review by Id',
        { result: 'success' },
        '/api/booking/review/delete/f51af79d-b9a8-4f0d-ae9a-b97f0e4e16a2',
    )
    @ApiErrorResponses(
        '/api/booking/review/delete/:id',
        '/api/booking/review/delete/d4112320-a998-4ff5-ba84-b31514f43bc6',
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
                    key: 'review_not_found',
                    summary: 'Review not found',
                    detail: 'Review not found',
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
        return await this.bookingReviewService.deleteReview({
            user: userData,
            ...data,
        } as DeleteReviewRequestDTO);
    }
}
