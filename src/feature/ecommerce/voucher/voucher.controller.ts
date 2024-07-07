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
    ApiResponseReadExample,
} from 'src/common/decorator/swagger.decorator';
import {
    CreateVoucher,
    CreateVoucherDTO,
    UpdateVoucher,
    DeleteVoucher,
    FindAllVouchersRequestDTO,
    FindVoucherByIdRequestDTO,
    UpdateVoucherRequestDTO,
    DeleteVoucherRequestDTO,
    FindVoucherByCodeRequestDTO,
    FindVoucher,
    FindAllVouchersByTenantRequestDTO,
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

    @Get('find')
    @ApiEndpoint({
        summary: `Find Vouchers`,
        details: `
## Description
Return all Vouchers within a domain.  

## Requirement
- Use only **domain** to find all Vouchers.
- Use **domain** and **id** to find only one Voucher
- User **domain** and **code** to find only one Voucher
- If use **domain** and **code** and **id**, Voucher will find by **domain** and **id**
`,
    })
    @ApiQueryExamples([
        {
            name: 'domain',
            description: 'domain of Voucher',
            example: '30shine.com',
            required: true,
        },
        {
            name: 'id',
            description: 'id of Voucher in Db',
            example: '384589ac-108a-4972-bbed-49771df4c7cb',
            required: false,
        },
        {
            name: 'code',
            description: 'code of Voucher in Db',
            example: 'GIAM30',
            required: false,
        },
    ])
    @ApiResponseReadExample('Vouchers', {
        getAll: {
            data: {
                vouchers: [
                    {
                        id: '384589ac-108a-4972-bbed-49771df4c7cb',
                        type: 'ecommerce',
                        domain: '30shine.com',
                        voucherName: 'giam gia 30%',
                        voucherCode: 'GIAM30',
                        maxDiscount: 30000,
                        minAppValue: 50000,
                        discountPercent: 0.3,
                        expireAt: 'Tue May 21 2024 00:29:45 GMT+0700 (Indochina Time)',
                        createdAt: 'Thu May 16 2024 17:05:02 GMT+0700 (Indochina Time)',
                        updatedAt: 'Thu May 16 2024 17:07:17 GMT+0700 (Indochina Time)',
                    },
                    {
                        id: '0bd91aad-69f2-4187-8141-9d04bd344f16',
                        type: 'ecommerce',
                        domain: '30shine.com',
                        voucherName: 'giam gia 60%',
                        voucherCode: 'GIAM60',
                        maxDiscount: 60000,
                        minAppValue: 2000000,
                        discountPercent: 0.6,
                        expireAt: 'Sat Jun 01 2024 00:29:45 GMT+0700 (Indochina Time)',
                        createdAt: 'Tue May 28 2024 16:46:06 GMT+0700 (Indochina Time)',
                        updatedAt: 'Tue May 28 2024 16:46:06 GMT+0700 (Indochina Time)',
                    },
                ],
            },
            path: '/api/ecommerce/voucher/find?domain=30shine.com',
        },
        findOne: {
            data: {
                voucher: {
                    id: '384589ac-108a-4972-bbed-49771df4c7cb',
                    type: 'ecommerce',
                    domain: '30shine.com',
                    voucherName: 'giam gia 30%',
                    voucherCode: 'GIAM30',
                    maxDiscount: 30000,
                    minAppValue: 50000,
                    discountPercent: 0.3,
                    expireAt: 'Tue May 21 2024 00:29:45 GMT+0700 (Indochina Time)',
                    createdAt: 'Thu May 16 2024 17:05:02 GMT+0700 (Indochina Time)',
                    updatedAt: 'Thu May 16 2024 17:07:17 GMT+0700 (Indochina Time)',
                },
            },
            path: '/api/ecommerce/voucher/find?domain=30shine.com&id=384589ac-108a-4972-bbed-49771df4c7cb',
        },
    })
    @ApiErrorResponses(
        '/api/ecommerce/voucher/find?domain=&id=&code=x',
        '/api/ecommerce/voucher/find?domain=30shine.com&id=384589ac-108a-4972-bbed-49771df4c7cc',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'id must be a UUID, domain should not be empty, domain must be a URL address',
            },
            unauthorized: [
                {
                    key: 'not_found',
                    summary: 'Voucher not found',
                    detail: 'Voucher not found',
                    error: 'Unauthorized',
                },
            ],
        },
    )
    async findVoucher(@Req() req: Request, @Query() data: FindVoucher) {
        if (data.id === undefined) {
            if (data.code === undefined) {
                return await this.ecommerceVoucherService.findAllVouchers({
                    domain: data.domain,
                } as FindAllVouchersRequestDTO);
            } else {
                return await this.ecommerceVoucherService.findVoucherByCode({
                    ...data,
                } as FindVoucherByCodeRequestDTO);
            }
        } else {
            return await this.ecommerceVoucherService.findVoucherById({
                ...data,
            } as FindVoucherByIdRequestDTO);
        }
    }

    @Get('find/tenant')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Find Vouchers By Tenant`,
        details: `
## Description
Return all Vouchers within a domain.  

## Requirement
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
`,
    })
    @ApiResponseReadExample('Vouchers', {
        getAll: {
            data: {
                vouchers: [
                    {
                        id: '384589ac-108a-4972-bbed-49771df4c7cb',
                        type: 'ecommerce',
                        domain: '30shine.com',
                        voucherName: 'giam gia 30%',
                        voucherCode: 'GIAM30',
                        maxDiscount: 30000,
                        minAppValue: 50000,
                        discountPercent: 0.3,
                        expireAt: 'Tue May 21 2024 00:29:45 GMT+0700 (Indochina Time)',
                        createdAt: 'Thu May 16 2024 17:05:02 GMT+0700 (Indochina Time)',
                        updatedAt: 'Thu May 16 2024 17:07:17 GMT+0700 (Indochina Time)',
                    },
                    {
                        id: '0bd91aad-69f2-4187-8141-9d04bd344f16',
                        type: 'ecommerce',
                        domain: '30shine.com',
                        voucherName: 'giam gia 60%',
                        voucherCode: 'GIAM60',
                        maxDiscount: 60000,
                        minAppValue: 2000000,
                        discountPercent: 0.6,
                        expireAt: 'Sat Jun 01 2024 00:29:45 GMT+0700 (Indochina Time)',
                        createdAt: 'Tue May 28 2024 16:46:06 GMT+0700 (Indochina Time)',
                        updatedAt: 'Tue May 28 2024 16:46:06 GMT+0700 (Indochina Time)',
                    },
                ],
            },
            path: '/api/ecommerce/voucher/find?domain=30shine.com',
        },
        findOne: {
            data: {
                voucher: {
                    id: '384589ac-108a-4972-bbed-49771df4c7cb',
                    type: 'ecommerce',
                    domain: '30shine.com',
                    voucherName: 'giam gia 30%',
                    voucherCode: 'GIAM30',
                    maxDiscount: 30000,
                    minAppValue: 50000,
                    discountPercent: 0.3,
                    expireAt: 'Tue May 21 2024 00:29:45 GMT+0700 (Indochina Time)',
                    createdAt: 'Thu May 16 2024 17:05:02 GMT+0700 (Indochina Time)',
                    updatedAt: 'Thu May 16 2024 17:07:17 GMT+0700 (Indochina Time)',
                },
            },
            path: '/api/ecommerce/voucher/find?domain=30shine.com&id=384589ac-108a-4972-bbed-49771df4c7cb',
        },
    })
    @ApiErrorResponses(
        '/api/ecommerce/voucher/find?domain=&id=&code=x',
        '/api/ecommerce/voucher/find?domain=30shine.com&id=384589ac-108a-4972-bbed-49771df4c7cc',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'id must be a UUID, domain should not be empty, domain must be a URL address',
            },
            unauthorized: [
                {
                    key: 'not_found',
                    summary: 'Voucher not found',
                    detail: 'Voucher not found',
                    error: 'Unauthorized',
                },
            ],
        },
    )
    async findAllVouchersByTenant(@Req() req: Request) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceVoucherService.findAllVouchersByTenant({
            user: userData,
        } as FindAllVouchersByTenantRequestDTO);
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
}
