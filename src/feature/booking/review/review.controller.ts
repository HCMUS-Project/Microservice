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
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { RolesGuard } from 'src/common/guards/role/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/proto_build/auth/userToken/Role';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { BookingReviewService } from './review.service';
import { CreateReview, CreateReviewRequestDTO } from './review.dto';

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
    @ApiOperation({
        summary: 'Create review of domain',
        description: `
## Use access token
## Must use tenant account`,
    })
    @ApiBody({
        type: CreateReview,
        examples: {
            category_1: {
                value: {} as CreateReview,
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
                        value: {},
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
                            path: '/api/booking/voucher/create',
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
                            path: '/api/booking/voucher/create',
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
                            path: '/api/booking/voucher/create',
                            message: 'Access Token not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
        content: {
            'application/json': {
                examples: {
                    user_not_verified: {
                        summary: 'Category already exists',
                        value: {
                            statusCode: 403,
                            timestamp: '2024-05-02T11:24:03.152Z',
                            path: '/api/booking/voucher/create',
                            message: 'Category already exists',
                            error: 'Forbidden',
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
        return await this.bookingReviewService.createReview({
            user: userData,
            ...data,
        } as CreateReviewRequestDTO);
    }

    //     @Get('find/all')
    //     @UseGuards(AccessTokenGuard)
    //     @ApiBearerAuth('JWT-access-token-user')
    //     @ApiBearerAuth('JWT-access-token-tenant')
    //     @ApiOperation({
    //         summary: 'Find all vouchers',
    //         description: `
    // ## Use access token`,
    //     })
    //     @ApiCreatedResponse({
    //         description: 'Get all vouchers successfully!!',
    //         content: {
    //             'application/json': {
    //                 examples: {
    //                     signin: {
    //                         summary: 'Response after get all vouchers successfully',
    //                         value: {
    //                             statusCode: 200,
    //                             timestamp: '2024-05-09T09:15:14.420Z',
    //                             path: '/api/booking/voucher/find/all',
    //                             message: null,
    //                             error: null,
    //                             data: {
    //                                 vouchers: [
    //                                     {
    //                                         id: 'b91cef5c-b0c7-4af9-a0cf-02c58adc87fb',
    //                                         serviceId: 'dfb82e86-2ecc-4eb3-8123-174b2299ad68',
    //                                         voucherName: 'Giam gia 50%',
    //                                         voucherCode: 'GIAM50',
    //                                         maxDiscountValue: 50000,
    //                                         minAppValue: 500000,
    //                                         discountPercent: 50,
    //                                         expiredTime:
    //                                             'Sun May 12 2024 12:51:38 GMT+0700 (Indochina Time)',
    //                                         createdAt:
    //                                             'Thu May 09 2024 16:08:59 GMT+0700 (Indochina Time)',
    //                                     },
    //                                     {
    //                                         id: 'fb6e2999-cc79-42cf-826a-a1e346ceccc6',
    //                                         serviceId: 'dfb82e86-2ecc-4eb3-8123-174b2299ad68',
    //                                         voucherName: 'Giam gia 30%',
    //                                         voucherCode: 'GIAM30',
    //                                         maxDiscountValue: 30000,
    //                                         minAppValue: 200000,
    //                                         discountPercent: 30,
    //                                         expiredTime:
    //                                             'Sun May 12 2024 12:51:38 GMT+0700 (Indochina Time)',
    //                                         createdAt:
    //                                             'Thu May 09 2024 16:14:11 GMT+0700 (Indochina Time)',
    //                                     },
    //                                 ],
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     })
    //     @ApiUnauthorizedResponse({
    //         description: 'Authorization failed',
    //         content: {
    //             'application/json': {
    //                 examples: {
    //                     token_not_verified: {
    //                         summary: 'Token not verified',
    //                         value: {
    //                             statusCode: 401,
    //                             timestamp: '2024-05-02T11:30:43.976Z',
    //                             path: '/api/booking/voucher/find/all',
    //                             message: 'Unauthorized',
    //                             error: null,
    //                             data: null,
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     })
    //     async findAllVouchers(@Req() req: Request) {
    //         const payloadToken = req['user'];
    //         // const header = req.headers;
    //         const userData = {
    //             email: payloadToken.email,
    //             domain: payloadToken.domain,
    //             role: payloadToken.role,
    //             accessToken: payloadToken.accessToken,
    //         } as UserDto;
    //         // console.log(userData, dataCategory)
    //         return await this.bookingVoucherService.findAllVouchers({
    //             user: userData,
    //         } as FindAllVouchersRequestDTO);
    //     }

    //     @Get('find/:id')
    //     @UseGuards(AccessTokenGuard)
    //     @ApiBearerAuth('JWT-access-token-user')
    //     @ApiBearerAuth('JWT-access-token-tenant')
    //     @ApiOperation({
    //         summary: 'Find one voucher by ID',
    //         description: `
    // ## Use access token
    // ## Use id to path`,
    //     })
    //     @ApiParam({
    //         name: 'id',
    //         description: 'ID of the voucher',
    //         example: 'fb6e2999-cc79-42cf-826a-a1e346ceccc6',
    //         required: true,
    //     })
    //     @ApiCreatedResponse({
    //         description: 'Get one voucher successfully!!',
    //         content: {
    //             'application/json': {
    //                 examples: {
    //                     signin: {
    //                         summary: 'Response after get one voucher successfully',
    //                         value: {
    //                             statusCode: 200,
    //                             timestamp: '2024-05-09T09:17:46.940Z',
    //                             path: '/api/booking/voucher/find/fb6e2999-cc79-42cf-826a-a1e346ceccc6',
    //                             message: null,
    //                             error: null,
    //                             data: {
    //                                 voucher: {
    //                                     id: 'fb6e2999-cc79-42cf-826a-a1e346ceccc6',
    //                                     serviceId: 'dfb82e86-2ecc-4eb3-8123-174b2299ad68',
    //                                     voucherName: 'Giam gia 30%',
    //                                     voucherCode: 'GIAM30',
    //                                     maxDiscountValue: 30000,
    //                                     minAppValue: 200000,
    //                                     discountPercent: 30,
    //                                     expiredTime:
    //                                         'Sun May 12 2024 12:51:38 GMT+0700 (Indochina Time)',
    //                                     createdAt: 'Thu May 09 2024 16:14:11 GMT+0700 (Indochina Time)',
    //                                 },
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     })
    //     @ApiUnauthorizedResponse({
    //         description: 'Authorization failed',
    //         content: {
    //             'application/json': {
    //                 examples: {
    //                     token_not_verified: {
    //                         summary: 'Token not verified',
    //                         value: {
    //                             statusCode: 401,
    //                             timestamp: '2024-04-27T17:42:40.039Z',
    //                             path: '/api/booking/voucher/find/fb6e2999-cc79-42cf-826a-a1e346ceccc6',
    //                             message: 'Unauthorized',
    //                             error: null,
    //                             data: null,
    //                         },
    //                     },
    //                     category_not_found: {
    //                         summary: 'Category not found',
    //                         value: {
    //                             statusCode: 401,
    //                             timestamp: '2024-05-02T11:43:05.882Z',
    //                             path: '/api/booking/voucher/find/fb6e2999-cc79-42cf-826a-a1e346ceccc6',
    //                             message: 'Category not found',
    //                             error: 'Unauthorized',
    //                             data: null,
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     })
    //     async findVoucherById(@Req() req: Request, @Param() params: FindOneVoucher) {
    //         const payloadToken = req['user'];
    //         // const header = req.headers;
    //         const userData = {
    //             email: payloadToken.email,
    //             domain: payloadToken.domain,
    //             role: payloadToken.role,
    //             accessToken: payloadToken.accessToken,
    //         } as UserDto;
    //         // console.log(userData, dataCategory)
    //         return await this.bookingVoucherService.findOneVoucher({
    //             user: userData,
    //             ...params,
    //         } as FindOneVoucherRequestDTO);
    //     }

    //     @Post('update')
    //     @UseGuards(AccessTokenGuard, RolesGuard)
    //     @Roles(Role.TENANT)
    //     @ApiBearerAuth('JWT-access-token-tenant')
    //     @ApiOperation({
    //         summary: 'Update one voucher',
    //         description: `
    // ## Use access token
    // ## Must be TENANT`,
    //     })
    //     @ApiBody({
    //         type: EditVoucher,
    //         examples: {
    //             category_1: {
    //                 value: {
    //                     id: 'b91cef5c-b0c7-4af9-a0cf-02c58adc87fb',
    //                     voucherName: 'Giam gia 55%',
    //                     voucherCode: 'GIAM55',
    //                     maxDiscountValue: 50000,
    //                     minAppValue: 500000,
    //                     discountPercent: 50,
    //                     expiredTime: '2024-05-12T05:51:38.792Z',
    //                 } as EditVoucher,
    //             },
    //         },
    //     })
    //     @ApiCreatedResponse({
    //         description: 'Update one voucher successfully!!',
    //         content: {
    //             'application/json': {
    //                 examples: {
    //                     signin: {
    //                         summary: 'Response after update voucher successfully',
    //                         value: {
    //                             statusCode: 201,
    //                             timestamp: '2024-05-09T09:24:00.450Z',
    //                             path: '/api/booking/voucher/update',
    //                             message: null,
    //                             error: null,
    //                             data: {
    //                                 result: 'success edit voucher',
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     })
    //     @ApiUnauthorizedResponse({
    //         description: 'Authorization failed',
    //         content: {
    //             'application/json': {
    //                 examples: {
    //                     token_not_verified: {
    //                         summary: 'Token not verified',
    //                         value: {
    //                             statusCode: 401,
    //                             timestamp: '2024-04-27T17:42:40.039Z',
    //                             path: '/api/booking/voucher/update',
    //                             message: 'Unauthorized',
    //                             error: null,
    //                             data: null,
    //                         },
    //                     },
    //                     category_not_found: {
    //                         summary: 'Category not found',
    //                         value: {
    //                             statusCode: 401,
    //                             timestamp: '2024-05-02T11:43:05.882Z',
    //                             path: '/api/booking/voucher/update',
    //                             message: 'Category not found',
    //                             error: 'Unauthorized',
    //                             data: null,
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     })
    //     async updateVoucher(@Req() req: Request, @Body() editVoucher: EditVoucher) {
    //         const payloadToken = req['user'];
    //         // const header = req.headers;
    //         const userData = {
    //             email: payloadToken.email,
    //             domain: payloadToken.domain,
    //             role: payloadToken.role,
    //             accessToken: payloadToken.accessToken,
    //         } as UserDto;
    //         // console.log(userData, dataCategory)
    //         return await this.bookingVoucherService.editVoucher({
    //             user: userData,
    //             ...editVoucher,
    //         } as EditVoucherRequestDTO);
    //     }

    //     @Delete('delete/:id')
    //     @UseGuards(AccessTokenGuard, RolesGuard)
    //     @Roles(Role.TENANT)
    //     @ApiBearerAuth('JWT-access-token-tenant')
    //     @ApiOperation({
    //         summary: 'Delete one voucher',
    //         description: `
    // ## Use access token
    // ## Must be TENANT`,
    //     })
    //     @ApiParam({
    //         name: 'id',
    //         description: 'ID of the voucher',
    //         example: 'b91cef5c-b0c7-4af9-a0cf-02c58adc87fb',
    //         required: true,
    //     })
    //     @ApiCreatedResponse({
    //         description: 'Delete one voucher successfully!!',
    //         content: {
    //             'application/json': {
    //                 examples: {
    //                     signin: {
    //                         summary: 'Response after delete voucher successfully',
    //                         value: {
    //                             statusCode: 200,
    //                             timestamp: '2024-05-09T09:26:26.854Z',
    //                             path: '/api/booking/voucher/delete/b91cef5c-b0c7-4af9-a0cf-02c58adc87fb',
    //                             message: null,
    //                             error: null,
    //                             data: {
    //                                 result: 'success',
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     })
    //     @ApiUnauthorizedResponse({
    //         description: 'Authorization failed',
    //         content: {
    //             'application/json': {
    //                 examples: {
    //                     token_not_verified: {
    //                         summary: 'Token not verified',
    //                         value: {
    //                             statusCode: 401,
    //                             timestamp: '2024-04-27T17:42:40.039Z',
    //                             path: '/api/ecommerce/category/update',
    //                             message: 'Unauthorized',
    //                             error: null,
    //                             data: null,
    //                         },
    //                     },
    //                     category_not_found: {
    //                         summary: 'Category not found',
    //                         value: {
    //                             statusCode: 401,
    //                             timestamp: '2024-05-02T11:43:05.882Z',
    //                             path: '/api/ecommerce/category/update',
    //                             message: 'Category not found',
    //                             error: 'Unauthorized',
    //                             data: null,
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     })
    //     async deleteVoucher(@Req() req: Request, @Param() params: DeleteVoucher) {
    //         const payloadToken = req['user'];
    //         // const header = req.headers;
    //         const userData = {
    //             email: payloadToken.email,
    //             domain: payloadToken.domain,
    //             role: payloadToken.role,
    //             accessToken: payloadToken.accessToken,
    //         } as UserDto;
    //         // console.log(userData, dataCategory)
    //         return await this.bookingVoucherService.deleteVoucher({
    //             user: userData,
    //             ...params,
    //         } as DeleteVoucherRequestDTO);
    //     }
}
