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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EcommerceVoucherService } from './voucher.service';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/proto_build/auth/userToken/Role';
import {
    ApiEndpoint,
    ApiBodyExample,
    ApiResponseExample,
    ApiErrorResponses,
    ApiQueryExamples,
    ApiParamExamples,
} from 'src/common/decorator/swagger.decorator';
import {
    CreateVoucher,
    CreateVoucherDTO,
    FindVoucherById,
    UpdateVoucher,
    DeleteVoucher,
    FindVoucherByCode,
    FindAllVouchersRequestDTO,
    FindVoucherByIdRequestDTO,
    UpdateVoucherRequestDTO,
    DeleteVoucherRequestDTO,
    FindVoucherByCodeRequestDTO,
} from './voucher.dto';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { RolesGuard } from 'src/common/guards/role/role.guard';
import { UserDto } from 'src/feature/commonDTO/user.dto';

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
    @ApiEndpoint({
        summary: `Create a voucher`,
        details: `
## Description
Create a voucher within a domain using an access token. This operation is restricted to tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
`,
    })
    @ApiBodyExample(CreateVoucher, {
        voucherName: 'giam gia 30%',
        voucherCode: 'GIAM',
        maxDiscount: 30000,
        minAppValue: 50000,
        discountPercent: 0.3,
        expireAt: '2024-05-16T17:29:45.256Z',
    })
    @ApiResponseExample(
        'create',
        'create Voucher',
        {
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
        '/api/ecommerce/voucher/create',
    )
    @ApiErrorResponses('/api/ecommerce/voucher/create', '/api/ecommerce/voucher/create', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'voucherName should not be empty, voucherCode should not be empty, maxDiscount should not be empty, maxDiscount must be a positive number, minAppValue must not be less than 0, minAppValue should not be empty, minAppValue must be a number conforming to the specified constraints, discountPercent must not be greater than 1, discountPercent must not be less than 0, discountPercent should not be empty, discountPercent must be a number conforming to the specified constraints, expireAt should not be empty, expireAt must be a valid ISO 8601 date string',
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
                key: 'already_exists',
                summary: 'Voucher already exists',
                detail: 'Voucher already exists',
            },
        ],
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
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Find all Vouchers`,
        details: `
## Description
Return all vouchers within a domain using an access token.  
        
## Requirements
- **Access Token**: Must provide a valid access token. 
`,
    })
    @ApiResponseExample(
        'read',
        'find all vouchers',
        {
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
                    expireAt: 'Sun May 05 2024 00:29:45 GMT+0700 (Indochina Time)',
                    createdAt: 'Tue May 14 2024 00:52:19 GMT+0700 (Indochina Time)',
                    updatedAt: 'Tue May 14 2024 00:52:19 GMT+0700 (Indochina Time)',
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
                    expireAt: 'Thu May 16 2024 00:29:45 GMT+0700 (Indochina Time)',
                    createdAt: 'Tue May 14 2024 00:53:18 GMT+0700 (Indochina Time)',
                    updatedAt: 'Tue May 14 2024 00:53:18 GMT+0700 (Indochina Time)',
                },
            ],
        },
        '/api/ecommerce/voucher/find/all',
    )
    @ApiErrorResponses('/api/ecommerce/voucher/find/all', '/api/ecommerce/voucher/find/all', {
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
    @ApiEndpoint({
        summary: `Find one voucher by ID`,
        details: `
## Description
Find a voucher within a domain using an access token.
## Requirements
- **Access Token**: Must provide a valid access token.
`,
    })
    @ApiParamExamples([
        {
            name: 'id',
            description: 'ID of the voucher',
            example: '3bb423de-2b81-4526-a1d3-9c3ca84633df',
            required: true,
        },
    ])
    @ApiResponseExample(
        'read',
        'find a voucher by Id',
        {
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
        '/api/ecommerce/voucher/find/7f461f30-e540-4f5e-ba1f-bdc6ffa0e4c0',
    )
    @ApiErrorResponses(
        '/api/ecommerce/voucher/find/:id',
        '/api/ecommerce/voucher/find/3bb423de-2b81-4526-a1d3-9c3ca84633df',
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
            ],
        },
    )
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
    @ApiEndpoint({
        summary: `Update a voucher`,
        details: `
## Description
Update a voucher within a domain using an access token. This operation is restricted to tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
`,
    })
    @ApiBodyExample(UpdateVoucher, {
        id: '2c6ebd84-a902-4568-810b-35415ad77e47',
        voucherName: 'giam gia 70%',
        voucherCode: 'GIAM70',
        maxDiscount: 70000,
        minAppValue: 1000000,
        discountPercent: 70,
        expireAt: '2024-05-05T17:29:45.256Z',
    })
    @ApiResponseExample(
        'update',
        'update Voucher',
        {
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
        '/api/ecommerce/voucher/update',
    )
    @ApiErrorResponses('/api/ecommerce/voucher/update', '/api/ecommerce/voucher/update', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'id should not be empty, id must be a UUID, voucherName should not be empty, voucherCode should not be empty, maxDiscount should not be empty, maxDiscount must be a positive number, minAppValue must not be less than 0, minAppValue should not be empty, minAppValue must be a number conforming to the specified constraints, discountPercent must not be greater than 1, discountPercent must not be less than 0, discountPercent should not be empty, discountPercent must be a number conforming to the specified constraints, expireAt should not be empty, expireAt must be a valid ISO 8601 date string',
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
        ],
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
    @ApiEndpoint({
        summary: `Delete one voucher by ID`,
        details: `
## Description
Delete a voucher within a domain using an access token. This operation is restricted to tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
`,
    })
    @ApiParamExamples([
        {
            name: 'id',
            description: 'ID of the voucher',
            example: 'eefdb88b-de10-4d14-b1a9-b762ffb0982a',
            required: true,
        },
    ])
    @ApiResponseExample(
        'delete',
        'delete a voucher by Id',
        {
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
        '/api/ecommerce/voucher/delete/7f461f30-e540-4f5e-ba1f-bdc6ffa0e4c0',
    )
    @ApiErrorResponses(
        '/api/ecommerce/voucher/delete/:id',
        '/api/ecommerce/voucher/delete/eefdb88b-de10-4d14-b1a9-b762ffb0982a',
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
            ],
        },
    )
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
    @ApiEndpoint({
        summary: `Search one voucher by voucher code`,
        details: `
## Description
Search a voucher within a domain using an access token.
        
## Requirements
- **Access Token**: Must provide a valid access token. 
`,
    })
    @ApiQueryExamples([
        {
            name: 'code',
            description: 'Voucher code',
            example: 'GIAM30',
            required: true,
        },
    ])
    @ApiResponseExample(
        'read',
        'search a voucher by code',
        {
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
        '/api/ecommerce/voucher/search/?code=GIAM30',
    )
    @ApiErrorResponses(
        '/api/ecommerce/voucher/search/',
        '/api/ecommerce/voucher/search/?code=GIAM70',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'Voucher code must be uppercase and contain no spaces, code should not be empty, code must be a string',
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
            ],
        },
    )
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
