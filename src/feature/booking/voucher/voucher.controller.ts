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
import { DeleteVoucherRequest } from 'src/proto_build/e_commerce/voucher/DeleteVoucherRequest';
import { BookingVoucherService } from './voucher.service';
import {
    CreateVoucher,
    CreateVoucherRequestDTO,
    DeleteVoucher,
    DeleteVoucherRequestDTO,
    EditVoucher,
    EditVoucherRequestDTO,
    FindAllVouchersRequestDTO,
    FindOneVoucher,
    FindOneVoucherRequestDTO,
} from './voucher.dto';
import { CreateBookingRequestDTO } from '../booking/booking.dto';
import {
    ApiBodyExample,
    ApiEndpoint,
    ApiErrorResponses,
    ApiParamExamples,
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';
import { UpdateVoucher } from 'src/feature/ecommerce/voucher/voucher.dto';

@Controller('/booking/voucher')
@ApiTags('booking/voucher')
export class VoucherController {
    constructor(
        @Inject('GRPC_ECOMMERCE_BOOKING_VOUCHER')
        private readonly bookingVoucherService: BookingVoucherService,
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
        serviceId: '2489bc57-5382-46a3-a03b-4276335261db',
        voucherName: 'Giam gia 50%',
        voucherCode: 'GIAM50',
        maxDiscountValue: 50000,
        minAppValue: 500000,
        discountPercent: 50,
        expiredTime: '2024-05-31T05:51:38.792Z',
    })
    @ApiResponseExample(
        'create',
        'create Voucher',
        {
            id: 'f21142ef-cece-4f14-83c1-eed2d485000a',
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
            {
                key: 'not_found',
                summary: 'Service not found',
                detail: 'Service not found',
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
        return await this.bookingVoucherService.createVoucher({
            user: userData,
            ...data,
        } as CreateVoucherRequestDTO);
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
                    id: 'f21142ef-cece-4f14-83c1-eed2d485000a',
                    type: 'booking',
                    serviceId: '2489bc57-5382-46a3-a03b-4276335261db',
                    voucherName: 'Giam gia 50%',
                    voucherCode: 'GIAM50',
                    maxDiscountValue: 50000,
                    minAppValue: 500000,
                    discountPercent: 50,
                    expiredTime: 'Fri May 31 2024 12:51:38 GMT+0700 (Indochina Time)',
                    createdAt: 'Fri May 24 2024 15:41:43 GMT+0700 (Indochina Time)',
                },
                {
                    id: 'dc479988-a135-41f7-8c75-206768808957',
                    type: 'booking',
                    serviceId: '2489bc57-5382-46a3-a03b-4276335261db',
                    voucherName: 'Giam gia 70%',
                    voucherCode: 'GIAM70',
                    maxDiscountValue: 70000,
                    minAppValue: 700000,
                    discountPercent: 70,
                    expiredTime: 'Fri May 31 2024 12:51:38 GMT+0700 (Indochina Time)',
                    createdAt: 'Fri May 24 2024 15:53:06 GMT+0700 (Indochina Time)',
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
        return await this.bookingVoucherService.findAllVouchers({
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
            example: 'f21142ef-cece-4f14-83c1-eed2d485000a',
            required: true,
        },
    ])
    @ApiResponseExample(
        'read',
        'find a voucher by Id',
        {
            voucher: {
                id: 'f21142ef-cece-4f14-83c1-eed2d485000a',
                type: 'booking',
                serviceId: '2489bc57-5382-46a3-a03b-4276335261db',
                voucherName: 'Giam gia 50%',
                voucherCode: 'GIAM50',
                maxDiscountValue: 50000,
                minAppValue: 500000,
                discountPercent: 50,
                expiredTime: 'Fri May 31 2024 12:51:38 GMT+0700 (Indochina Time)',
                createdAt: 'Fri May 24 2024 15:41:43 GMT+0700 (Indochina Time)',
            },
        },
        '/api/booking/voucher/find/f21142ef-cece-4f14-83c1-eed2d485000a',
    )
    @ApiErrorResponses(
        '/api/booking/voucher/find/:id',
        '/api/booking/voucher/find/f21142ef-cece-4f14-83c1-eed2d485000a',
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
    async findVoucherById(@Req() req: Request, @Param() params: FindOneVoucher) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.bookingVoucherService.findOneVoucher({
            user: userData,
            ...params,
        } as FindOneVoucherRequestDTO);
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
    @ApiBodyExample(EditVoucher, {})
    @ApiResponseExample(
        'update',
        'update Voucher',
        {
            id: 'f21142ef-cece-4f14-83c1-eed2d485000a',
            voucherName: 'Giam gia 55%',
        },
        '/api/booking/voucher/update',
    )
    @ApiErrorResponses('/api/booking/voucher/update', '/api/booking/voucher/update', {
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
    async updateVoucher(@Req() req: Request, @Body() editVoucher: EditVoucher) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.bookingVoucherService.editVoucher({
            user: userData,
            ...editVoucher,
        } as EditVoucherRequestDTO);
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
            example: 'f21142ef-cece-4f14-83c1-eed2d485000a',
            required: true,
        },
    ])
    @ApiResponseExample(
        'delete',
        'delete a voucher by Id',
        { result: 'success' },
        '/api/booking/voucher/delete/f21142ef-cece-4f14-83c1-eed2d485000a',
    )
    @ApiErrorResponses(
        '/api/booking/voucher/delete/:id',
        '/api/booking/voucher/delete/f21142ef-cece-4f14-83c1-eed2d485000a',
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
    async deleteVoucher(@Req() req: Request, @Param() params: DeleteVoucher) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.bookingVoucherService.deleteVoucher({
            user: userData,
            ...params,
        } as DeleteVoucherRequestDTO);
    }
}
