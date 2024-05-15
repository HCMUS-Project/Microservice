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
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOkResponse,
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
    DeleteVoucher,
    DeleteVoucherRequestDTO,
    FindAllVouchersRequestDTO,
    FindVoucherByCode,
    FindVoucherByCodeRequestDTO,
    FindVoucherById,
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
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Create voucher of domain',
        description: `
## Use access token
## Must use tenant account`,
    })
    @ApiBody({
        type: CreateVoucher,
        examples: {
            voucher_1: {
                summary: 'Example body voucher',
                value: {
                    voucherName: 'giam gia 30%',
                    voucherCode: 'GIAM',
                    maxDiscount: 30000,
                    minAppValue: 50000,
                    discountPercent: 0.3,
                    expireAt: '2024-05-16T17:29:45.256Z',
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
                            timestamp: '2024-05-13T17:13:13.001Z',
                            path: '/api/ecommerce/voucher/create',
                            message: null,
                            error: null,
                            data: {
                                voucher: {
                                    id: '6873714c-2668-478e-8d5f-0c5db293b540',
                                    type: 'ecommerce',
                                    domain: '30shine.com',
                                    voucherName: 'giam gia 30%',
                                    voucherCode: 'GIAM',
                                    maxDiscount: 30000,
                                    minAppValue: 50000,
                                    discountPercent: 0.3,
                                    expireAt: 'Fri May 17 2024 00:29:45 GMT+0700 (Indochina Time)',
                                    createdAt: 'Tue May 14 2024 00:13:12 GMT+0700 (Indochina Time)',
                                    updatedAt: 'Tue May 14 2024 00:13:12 GMT+0700 (Indochina Time)',
                                },
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Validation failed',
        content: {
            'application/json': {
                examples: {
                    all_field_missing: {
                        summary: 'Response if all field missing and not valid with request',
                        value: {
                            statusCode: 400,
                            timestamp: '2024-05-13T17:14:11.524Z',
                            path: '/api/ecommerce/voucher/create',
                            message:
                                'voucherName should not be empty, voucherCode should not be empty, maxDiscount should not be empty, maxDiscount must be a positive number, minAppValue must not be less than 0, minAppValue should not be empty, minAppValue must be a number conforming to the specified constraints, discountPercent must not be greater than 1, discountPercent must not be less than 0, discountPercent should not be empty, discountPercent must be a number conforming to the specified constraints, expireAt should not be empty, expireAt must be a valid ISO 8601 date string',
                            error: 'Bad Request',
                            data: null,
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
                            path: '/api/ecommerce/voucher/create',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                    token_not_found: {
                        summary: 'Token not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-02T10:55:28.511Z',
                            path: '/api/ecommerce/voucher/create',
                            message: 'Access Token not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                    unauthorized_role: {
                        summary: 'Role not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-27T12:31:30.700Z',
                            path: '/api/ecommerce/voucher/create',
                            message: 'Unauthorized Role',
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
                    voucher_already_exists: {
                        summary: 'Voucher already exists',
                        value: {
                            statusCode: 403,
                            timestamp: '2024-05-13T17:23:08.413Z',
                            path: '/api/ecommerce/voucher/create',
                            message: 'Voucher already exists',
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
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOkResponse({
        description: 'Get all vouchers successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after get all vouchers successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-13T17:53:28.997Z',
                            path: '/api/ecommerce/voucher/find/all',
                            message: null,
                            error: null,
                            data: {
                                vouchers: [
                                    {
                                        id: '8f8b55c7-f0ae-427a-aec8-201beb10295f',
                                        type: 'ecommerce',
                                        domain: '30shine.com',
                                        voucherName: 'giam gia 30%',
                                        voucherCode: 'GIAM30',
                                        maxDiscount: 30000,
                                        minAppValue: 50000,
                                        discountPercent: 0.3,
                                        expireAt:
                                            'Sun May 05 2024 00:29:45 GMT+0700 (Indochina Time)',
                                        createdAt:
                                            'Tue May 14 2024 00:52:19 GMT+0700 (Indochina Time)',
                                        updatedAt:
                                            'Tue May 14 2024 00:52:19 GMT+0700 (Indochina Time)',
                                    },
                                    {
                                        id: '7f461f30-e540-4f5e-ba1f-bdc6ffa0e4c0',
                                        type: 'ecommerce',
                                        domain: '30shine.com',
                                        voucherName: 'giam gia 50%',
                                        voucherCode: 'GIAM50',
                                        maxDiscount: 50000,
                                        minAppValue: 500000,
                                        discountPercent: 0.5,
                                        expireAt:
                                            'Thu May 16 2024 00:29:45 GMT+0700 (Indochina Time)',
                                        createdAt:
                                            'Tue May 14 2024 00:53:18 GMT+0700 (Indochina Time)',
                                        updatedAt:
                                            'Tue May 14 2024 00:53:18 GMT+0700 (Indochina Time)',
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
                            timestamp: '2024-04-27T17:42:40.039Z',
                            path: '/api/ecommerce/voucher/find/all',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                    token_not_found: {
                        summary: 'Token not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-02T10:55:28.511Z',
                            path: '/api/ecommerce/voucher/find/all',
                            message: 'Access Token not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                    unauthorized_role: {
                        summary: 'Role not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-27T12:31:30.700Z',
                            path: '/api/ecommerce/voucher/find/all',
                            message: 'Unauthorized Role',
                            error: 'Unauthorized',
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
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Find one voucher by ID',
        description: `
## Use access token
## Use id to path`,
    })
    @ApiParam({
        name: 'id',
        description: 'ID of the voucher',
        example: '3bb423de-2b81-4526-a1d3-9c3ca84633df',
        required: true,
    })
    @ApiOkResponse({
        description: 'Get one voucher successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after get one voucher successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-13T18:01:12.923Z',
                            path: '/api/ecommerce/voucher/find/7f461f30-e540-4f5e-ba1f-bdc6ffa0e4c0',
                            message: null,
                            error: null,
                            data: {
                                voucher: {
                                    id: '7f461f30-e540-4f5e-ba1f-bdc6ffa0e4c0',
                                    type: 'ecommerce',
                                    domain: '30shine.com',
                                    voucherName: 'giam gia 50%',
                                    voucherCode: 'GIAM50',
                                    maxDiscount: 50000,
                                    minAppValue: 500000,
                                    discountPercent: 0.5,
                                    expireAt: 'Thu May 16 2024 00:29:45 GMT+0700 (Indochina Time)',
                                    createdAt: 'Tue May 14 2024 00:53:18 GMT+0700 (Indochina Time)',
                                    updatedAt: 'Tue May 14 2024 00:53:18 GMT+0700 (Indochina Time)',
                                },
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Validation failed',
        content: {
            'application/json': {
                examples: {
                    all_field_missing: {
                        summary: 'Response if all field missing and not valid with request',
                        value: {
                            statusCode: 400,
                            timestamp: '2024-05-13T17:57:49.128Z',
                            path: '/api/ecommerce/voucher/find/:id',
                            message: 'id must be a UUID',
                            error: 'Bad Request',
                            data: null,
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
                            path: '/api/ecommerce/voucher/find/3bb423de-2b81-4526-a1d3-9c3ca84633df',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                    token_not_found: {
                        summary: 'Token not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-02T10:55:28.511Z',
                            path: '/api/ecommerce/voucher/find/3bb423de-2b81-4526-a1d3-9c3ca84633df',
                            message: 'Access Token not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                    unauthorized_role: {
                        summary: 'Role not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-27T12:31:30.700Z',
                            path: '/api/ecommerce/voucher/find/3bb423de-2b81-4526-a1d3-9c3ca84633df',
                            message: 'Unauthorized Role',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                    voucher_not_found: {
                        summary: 'Voucher not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-13T17:58:04.724Z',
                            path: '/api/ecommerce/voucher/find/3bb423de-2b81-4526-a1d3-9c3ca84633df',
                            message: 'Voucher not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async findVoucherById(@Req() req: Request, @Param() data: FindVoucherById) {
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
            ...data,
        } as FindVoucherByIdRequestDTO);
    }

    @Post('update')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Update one voucher',
        description: `
## Use access token
## Must be TENANT`,
    })
    @ApiBody({
        type: UpdateVoucher,
        examples: {
            voucher_1: {
                summary: 'Example body voucher update',
                value: {
                    id: '2c6ebd84-a902-4568-810b-35415ad77e47',
                    voucherName: 'giam gia 70%',
                    voucherCode: 'GIAM70',
                    maxDiscount: 70000,
                    minAppValue: 1000000,
                    discountPercent: 70,
                    expireAt: '2024-05-05T17:29:45.256Z',
                } as UpdateVoucher,
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Validation failed',
        content: {
            'application/json': {
                examples: {
                    all_field_missing: {
                        summary: 'Response if all field missing and not valid with request',
                        value: {
                            statusCode: 400,
                            timestamp: '2024-05-13T18:08:44.721Z',
                            path: '/api/ecommerce/voucher/update',
                            message:
                                'id should not be empty, id must be a UUID, voucherName should not be empty, voucherCode should not be empty, maxDiscount should not be empty, maxDiscount must be a positive number, minAppValue must not be less than 0, minAppValue should not be empty, minAppValue must be a number conforming to the specified constraints, discountPercent must not be greater than 1, discountPercent must not be less than 0, discountPercent should not be empty, discountPercent must be a number conforming to the specified constraints, expireAt should not be empty, expireAt must be a valid ISO 8601 date string',
                            error: 'Bad Request',
                            data: null,
                        },
                    },
                },
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
                            timestamp: '2024-05-13T18:16:40.776Z',
                            path: '/api/ecommerce/voucher/update',
                            message: null,
                            error: null,
                            data: {
                                voucher: {
                                    id: '7f461f30-e540-4f5e-ba1f-bdc6ffa0e4c0',
                                    type: 'ecommerce',
                                    domain: '30shine.com',
                                    voucherName: 'giam gia 70%',
                                    voucherCode: 'GIAM70',
                                    maxDiscount: 70000,
                                    minAppValue: 1000000,
                                    discountPercent: 0.7,
                                    expireAt: 'Mon May 06 2024 00:29:45 GMT+0700 (Indochina Time)',
                                    createdAt: 'Tue May 14 2024 00:53:18 GMT+0700 (Indochina Time)',
                                    updatedAt: 'Tue May 14 2024 01:16:40 GMT+0700 (Indochina Time)',
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
                            path: '/api/ecommerce/voucher/update',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                    token_not_found: {
                        summary: 'Token not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-02T10:55:28.511Z',
                            path: '/api/ecommerce/voucher/update',
                            message: 'Access Token not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                    unauthorized_role: {
                        summary: 'Role not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-27T12:31:30.700Z',
                            path: '/api/ecommerce/voucher/update',
                            message: 'Unauthorized Role',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                    voucher_not_found: {
                        summary: 'Voucher not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-13T18:15:16.058Z',
                            path: '/api/ecommerce/voucher/update',
                            message: 'Voucher not found',
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
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Delete one voucher',
        description: `
## Use access token
## Must be TENANT`,
    })
    @ApiParam({
        name: 'id',
        description: 'ID of the voucher',
        example: 'eefdb88b-de10-4d14-b1a9-b762ffb0982a',
        required: true,
    })
    @ApiOkResponse({
        description: 'Delete one voucher successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after delete voucher successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-13T18:25:05.509Z',
                            path: '/api/ecommerce/voucher/delete/7f461f30-e540-4f5e-ba1f-bdc6ffa0e4c0',
                            message: null,
                            error: null,
                            data: {
                                voucher: {
                                    id: '7f461f30-e540-4f5e-ba1f-bdc6ffa0e4c0',
                                    type: 'ecommerce',
                                    domain: '30shine.com',
                                    voucherName: 'giam gia 70%',
                                    voucherCode: 'GIAM70',
                                    maxDiscount: 70000,
                                    minAppValue: 1000000,
                                    discountPercent: 0.7,
                                    expireAt: 'Mon May 06 2024 00:29:45 GMT+0700 (Indochina Time)',
                                    createdAt: 'Tue May 14 2024 00:53:18 GMT+0700 (Indochina Time)',
                                    updatedAt: 'Tue May 14 2024 01:16:40 GMT+0700 (Indochina Time)',
                                },
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Validation failed',
        content: {
            'application/json': {
                examples: {
                    all_field_missing: {
                        summary: 'Response if all field missing and not valid with request',
                        value: {
                            statusCode: 400,
                            timestamp: '2024-05-13T18:20:33.617Z',
                            path: '/api/ecommerce/voucher/delete/:id',
                            message: 'id must be a UUID',
                            error: 'Bad Request',
                            data: null,
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
                            path: '/api/ecommerce/voucher/delete/eefdb88b-de10-4d14-b1a9-b762ffb0982a',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                    token_not_found: {
                        summary: 'Token not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-02T10:55:28.511Z',
                            path: '/api/ecommerce/voucher/delete/eefdb88b-de10-4d14-b1a9-b762ffb0982a',
                            message: 'Access Token not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                    unauthorized_role: {
                        summary: 'Role not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-27T12:31:30.700Z',
                            path: '/api/ecommerce/voucher/delete/eefdb88b-de10-4d14-b1a9-b762ffb0982a',
                            message: 'Unauthorized Role',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                    voucher_not_found: {
                        summary: 'Voucher not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-13T18:20:57.932Z',
                            path: '/api/ecommerce/voucher/delete/eefdb88b-de10-4d14-b1a9-b762ffb0982a',
                            message: 'Voucher not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async deleteVoucher(@Req() req: Request, @Param() data: DeleteVoucher) {
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
            ...data,
        } as DeleteVoucherRequestDTO);
    }

    @Get('search')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Search one voucher by voucher code',
        description: `
## Use access token
## Must be TENANT`,
    })
    @ApiQuery({
        name: 'code',
        description: 'Voucher code',
        required: true,
        example: 'GIAM30',
    })
    @ApiOkResponse({
        description: 'Search one voucher successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after find voucher successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-13T18:39:39.866Z',
                            path: '/api/ecommerce/voucher/search/?code=GIAM30',
                            message: null,
                            error: null,
                            data: {
                                voucher: {
                                    id: '8f8b55c7-f0ae-427a-aec8-201beb10295f',
                                    type: 'ecommerce',
                                    domain: '30shine.com',
                                    voucherName: 'giam gia 30%',
                                    voucherCode: 'GIAM30',
                                    maxDiscount: 30000,
                                    minAppValue: 50000,
                                    discountPercent: 0.3,
                                    expireAt: 'Sun May 05 2024 00:29:45 GMT+0700 (Indochina Time)',
                                    createdAt: 'Tue May 14 2024 00:52:19 GMT+0700 (Indochina Time)',
                                    updatedAt: 'Tue May 14 2024 00:52:19 GMT+0700 (Indochina Time)',
                                },
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Validation failed',
        content: {
            'application/json': {
                examples: {
                    all_field_missing: {
                        summary: 'Response if all field missing and not valid with request',
                        value: {
                            statusCode: 400,
                            timestamp: '2024-05-13T18:40:34.725Z',
                            path: '/api/ecommerce/voucher/search/',
                            message:
                                'Voucher code must be uppercase and contain no spaces, code should not be empty, code must be a string',
                            error: 'Bad Request',
                            data: null,
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
                            path: '/api/ecommerce/voucher/search/?code=GIAM70',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                    token_not_found: {
                        summary: 'Token not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-02T10:55:28.511Z',
                            path: '/api/ecommerce/voucher/search/?code=GIAM70',
                            message: 'Access Token not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                    unauthorized_role: {
                        summary: 'Role not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-27T12:31:30.700Z',
                            path: '/api/ecommerce/voucher/search/?code=GIAM70',
                            message: 'Unauthorized Role',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                    voucher_not_found: {
                        summary: 'Voucher not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-13T18:37:30.973Z',
                            path: '/api/ecommerce/voucher/search/?code=GIAM70',
                            message: 'Voucher not found',
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
        query: FindVoucherByCode,
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
