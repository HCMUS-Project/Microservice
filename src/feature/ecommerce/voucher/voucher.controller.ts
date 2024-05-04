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
import { EcommerceVoucherService } from './voucher.service';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { RolesGuard } from 'src/common/guards/role/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/proto_build/auth/userToken/Role';
import { CreateCategory } from '../category/category.dto';
import {
    CreateVoucher,
    CreateVoucherDTO,
    DeleteVoucherRequestDTO,
    FindAllVouchersRequestDTO,
    FindVoucherByCodeRequestDTO,
    FindVoucherByIdRequestDTO,
    UpdateVoucher,
    UpdateVoucherRequestDTO,
} from './voucher.dto';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { DeleteVoucherRequest } from 'src/proto_build/e_commerce/voucher/DeleteVoucherRequest';

@Controller('/ecommerce/voucher')
@ApiTags('ecommerce/voucher')
export class VoucherController {
    constructor(
        @Inject('GRPC_ECOMMERCE_SERVICE_VOUCHER')
        private readonly ecommerceVoucherService: EcommerceVoucherService,
    ) {}

    @Post('create')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiOperation({
        summary: 'Create voucher of domain',
        description: `
## Use access token
## Must use tenant account`,
    })
    @ApiBearerAuth('JWT-access-token')
    @ApiBody({
        type: CreateVoucher,
        examples: {
            category_1: {
                value: {
                    voucherName: 'giam gia 50%',
                    voucherCode: 'GIAM50',
                    maxDiscount: 50000,
                    minAppValue: 100000,
                    discountPercent: 0.5,
                    expireAt: '2024-05-04T17:29:45.256Z',
                } as CreateVoucher,
            },
        },
    })
    @ApiCreatedResponse({
        description: 'Create voucher successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after Create voucher successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-05-04T10:42:23.073Z',
                            path: '/api/ecommerce/voucher/create',
                            message: null,
                            error: null,
                            data: {
                                voucher: {
                                    id: 'd015fa51-05aa-4cb6-baa2-a82f49dcc88a',
                                    domain: '30shine.com',
                                    voucherName: 'giam gia 30%',
                                    voucherCode: 'GIAM',
                                    maxDiscount: 30000,
                                    minAppValue: 50000,
                                    discountPercent: 0.3,
                                    expireAt: 'Sun May 05 2024 00:29:45 GMT+0700 (Indochina Time)',
                                    createdAt: 'Sat May 04 2024 17:42:23 GMT+0700 (Indochina Time)',
                                    updatedAt: 'Sat May 04 2024 17:42:23 GMT+0700 (Indochina Time)',
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
                            path: '/api/ecommerce/category/create',
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
                            path: '/api/ecommerce/category/create',
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
                            path: '/api/ecommerce/category/create',
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
                            path: '/api/ecommerce/category/create',
                            message: 'Category already exists',
                            error: 'Forbidden',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async createVoucher(@Req() req: Request, @Body() data: CreateVoucher) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceVoucherService.createVoucher({
            user: userData,
            ...data,
        } as CreateVoucherDTO);
    }

    @Get('find/all')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({
        summary: 'Find all vouchers',
        description: `
## Use access token`,
    })
    @ApiBearerAuth('JWT-access-token')
    @ApiCreatedResponse({
        description: 'Get all vouchers successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after get all vouchers successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-04T10:48:53.171Z',
                            path: '/api/ecommerce/voucher/find/all',
                            message: null,
                            error: null,
                            data: {
                                vouchers: [
                                    {
                                        id: '2c6ebd84-a902-4568-810b-35415ad77e47',
                                        domain: '30shine.com',
                                        voucherName: 'Giảm 70% tiền',
                                        voucherCode: 'GIAM70',
                                        maxDiscount: 50000,
                                        minAppValue: 2000000,
                                        discountPercent: 0.7,
                                        expireAt:
                                            'Thu May 02 2024 17:15:23 GMT+0700 (Indochina Time)',
                                        createdAt:
                                            'Wed May 01 2024 17:15:23 GMT+0700 (Indochina Time)',
                                        updatedAt:
                                            'Wed May 01 2024 18:19:45 GMT+0700 (Indochina Time)',
                                    },
                                    {
                                        id: 'eefdb88b-de10-4d14-b1a9-b762ffb0982a',
                                        domain: '30shine.com',
                                        voucherName: 'giam gia 50%',
                                        voucherCode: 'GIAM50',
                                        maxDiscount: 50000,
                                        minAppValue: 100000,
                                        discountPercent: 0.5,
                                        expireAt:
                                            'Sun May 05 2024 00:29:45 GMT+0700 (Indochina Time)',
                                        createdAt:
                                            'Sat May 04 2024 17:32:56 GMT+0700 (Indochina Time)',
                                        updatedAt:
                                            'Sat May 04 2024 17:32:56 GMT+0700 (Indochina Time)',
                                    },
                                    {
                                        id: '3bb423de-2b81-4526-a1d3-9c3ca84633df',
                                        domain: '30shine.com',
                                        voucherName: 'giam gia 30%',
                                        voucherCode: 'GIAM30',
                                        maxDiscount: 30000,
                                        minAppValue: 50000,
                                        discountPercent: 0.3,
                                        expireAt:
                                            'Sun May 05 2024 00:29:45 GMT+0700 (Indochina Time)',
                                        createdAt:
                                            'Sat May 04 2024 17:42:00 GMT+0700 (Indochina Time)',
                                        updatedAt:
                                            'Sat May 04 2024 17:42:00 GMT+0700 (Indochina Time)',
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
                            path: '/api/ecommerce/category/find/all',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async findAllVouchers(@Req() req: Request) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceVoucherService.findAllVouchers({
            user: userData,
        } as FindAllVouchersRequestDTO);
    }

    @Get('find/:id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({
        summary: 'Find one voucher by ID',
        description: `
## Use access token
## Use id to path`,
    })
    @ApiParam({ name: 'id', description: 'ID of the voucher', required: true })
    @ApiBearerAuth('JWT-access-token')
    @ApiCreatedResponse({
        description: 'Get one voucher successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after get one voucher successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-04T10:58:44.722Z',
                            path: '/api/ecommerce/voucher/find/3bb423de-2b81-4526-a1d3-9c3ca84633df',
                            message: null,
                            error: null,
                            data: {
                                voucher: {
                                    id: '3bb423de-2b81-4526-a1d3-9c3ca84633df',
                                    domain: '30shine.com',
                                    voucherName: 'giam gia 30%',
                                    voucherCode: 'GIAM30',
                                    maxDiscount: 30000,
                                    minAppValue: 50000,
                                    discountPercent: 0.3,
                                    expireAt: 'Sun May 05 2024 00:29:45 GMT+0700 (Indochina Time)',
                                    createdAt: 'Sat May 04 2024 17:42:00 GMT+0700 (Indochina Time)',
                                    updatedAt: 'Sat May 04 2024 17:42:00 GMT+0700 (Indochina Time)',
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
                            path: '/api/ecommerce/category/find/93f55388-cd92-4f76-8ece-60fcf16f6806',
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
                            path: '/api/ecommerce/category/find/93f55388-cd92-4f76-8ece-60fcf16f680',
                            message: 'Category not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async findVoucherById(@Req() req: Request, @Param('id') id: string) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceVoucherService.findVoucherById({
            user: userData,
            id,
        } as FindVoucherByIdRequestDTO);
    }

    @Post('update')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiOperation({
        summary: 'Update one voucher',
        description: `
## Use access token
## Must be TENANT`,
    })
    @ApiBody({
        type: UpdateVoucher,
        examples: {
            category_1: {
                value: {
                    id: '2c6ebd84-a902-4568-810b-35415ad77e47',
                    voucherName: 'giam gia 70%',
                    voucherCode: 'GIAM70',
                    maxDiscount: 70000,
                    minAppValue: 1000000,
                    discountPercent: 0.7,
                    expireAt: '2024-05-05T17:29:45.256Z',
                } as UpdateVoucher,
            },
        },
    })
    @ApiBearerAuth('JWT-access-token')
    @ApiCreatedResponse({
        description: 'Update one voucher successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after update voucher successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-05-04T11:15:28.621Z',
                            path: '/api/ecommerce/voucher/update',
                            message: null,
                            error: null,
                            data: {
                                voucher: {
                                    id: '2c6ebd84-a902-4568-810b-35415ad77e47',
                                    domain: '30shine.com',
                                    voucherName: 'giam gia 70%',
                                    voucherCode: 'GIAM70',
                                    maxDiscount: 70000,
                                    minAppValue: 1000000,
                                    discountPercent: 0.7,
                                    expireAt: 'Mon May 06 2024 00:29:45 GMT+0700 (Indochina Time)',
                                    createdAt: 'Wed May 01 2024 17:15:23 GMT+0700 (Indochina Time)',
                                    updatedAt: 'Sat May 04 2024 18:15:28 GMT+0700 (Indochina Time)',
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
    async updateVoucher(@Req() req: Request, @Body() updateVoucher: UpdateVoucher) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceVoucherService.updateVoucher({
            user: userData,
            ...updateVoucher,
        } as UpdateVoucherRequestDTO);
    }

    @Delete('delete/:id')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiOperation({
        summary: 'Delete one voucher',
        description: `
## Use access token
## Must be TENANT`,
    })
    @ApiBearerAuth('JWT-access-token')
    @ApiCreatedResponse({
        description: 'Delete one voucher successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after delete voucher successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-04T11:27:47.141Z',
                            path: '/api/ecommerce/voucher/delete/eefdb88b-de10-4d14-b1a9-b762ffb0982a',
                            message: null,
                            error: null,
                            data: {
                                voucher: {
                                    id: 'eefdb88b-de10-4d14-b1a9-b762ffb0982a',
                                    domain: '30shine.com',
                                    voucherName: 'giam gia 50%',
                                    voucherCode: 'GIAM50',
                                    maxDiscount: 50000,
                                    minAppValue: 100000,
                                    discountPercent: 0.5,
                                    expireAt: 'Sun May 05 2024 00:29:45 GMT+0700 (Indochina Time)',
                                    createdAt: 'Sat May 04 2024 17:32:56 GMT+0700 (Indochina Time)',
                                    updatedAt: 'Sat May 04 2024 17:32:56 GMT+0700 (Indochina Time)',
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
        return await this.ecommerceVoucherService.deleteVoucher({
            user: userData,
            id,
        } as DeleteVoucherRequestDTO);
    }

    @Get('search')
    @ApiQuery({
        name: 'voucher_code',
        description: 'Voucher code',
        required: true,
        example: 'GIAM70',
    })
    @UseGuards(AccessTokenGuard)
    @ApiOperation({
        summary: 'Search one voucher by voucher code',
        description: `
## Use access token
## Must be TENANT`,
    })
    @ApiBearerAuth('JWT-access-token')
    @ApiCreatedResponse({
        description: 'Search one voucher successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after find voucher successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-04T11:49:02.025Z',
                            path: '/api/ecommerce/voucher/find/?code=GIAM70',
                            message: null,
                            error: null,
                            data: {
                                voucher: {
                                    id: '2c6ebd84-a902-4568-810b-35415ad77e47',
                                    domain: '30shine.com',
                                    voucherName: 'giam gia 70%',
                                    voucherCode: 'GIAM70',
                                    maxDiscount: 70000,
                                    minAppValue: 1000000,
                                    discountPercent: 0.7,
                                    expireAt: 'Mon May 06 2024 00:29:45 GMT+0700 (Indochina Time)',
                                    createdAt: 'Wed May 01 2024 17:15:23 GMT+0700 (Indochina Time)',
                                    updatedAt: 'Sat May 04 2024 18:15:28 GMT+0700 (Indochina Time)',
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
    async findVoucherByCode(
        @Req() req: Request,
        @Query()
        query: {
            code?: string;
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
        // console.log(code)
        return await this.ecommerceVoucherService.findVoucherByCode({
            user: userData,
            ...query,
        } as FindVoucherByCodeRequestDTO);
    }
}
