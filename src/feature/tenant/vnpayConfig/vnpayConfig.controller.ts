import { Body, Controller, Delete, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { RolesGuard } from 'src/common/guards/role/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import {
    ApiBodyExample,
    ApiEndpoint,
    ApiErrorResponses,
    ApiParamExamples,
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';
import { TenantVNPayConfigService } from './vnpayConfig.service';
import {
    CreateVNPayConfig,
    CreateVNPayConfigRequestDTO,
    DeleteVNPayConfig,
    DeleteVNPayConfigRequestDTO,
    GetVNPayConfigByTenantIdRequestDTO,
    UpdateVNPayConfig,
    UpdateVNPayConfigRequestDTO,
} from './vnpayConfig.dto';

@Controller('tenant/payment/vnpay')
@ApiTags('tenant/payment/vnpay')
export class VNPayController {
    constructor(
        @Inject('GRPC_TENANT_SERVICE_VNPAY')
        private readonly tenantVNPayConfigService: TenantVNPayConfigService,
    ) {}

    @Post('create')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Create a VNPay Config`,
        details: `
## Description
Create a VNPay Config within a domain using an access token. This operation is restricted to tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
`,
    })
    @ApiBodyExample(CreateVNPayConfig, {
        tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
        tmnCode: 'TMNCODEEXAMPLE',
        secureSecret: 'SECRETKEYEXAMPLE',
        vnpayHost: 'https://sandbox.vnpayment.vn',
    })
    @ApiResponseExample(
        'create',
        'create VNPay Config',
        {
            vnpayConfig: {
                id: 'f6452a8e-2915-45ab-adc7-3cee8e2857b4',
                tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                tmnCode: 'TMNCODEEXAMPLE',
                secureSecret: 'SECRETKEYEXAMPLE',
                vnpayHost: 'https://sandbox.vnpayment.vn',
            },
        },
        '/api/tenant/payment/vnpay/create',
    )
    @ApiErrorResponses('/api/tenant/payment/vnpay/create', '/api/tenant/payment/vnpay/create', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'tenantId should not be empty, tenantId must be a UUID, tmnCode should not be empty, tmnCode must be a string, secureSecret should not be empty, secureSecret must be a string, vnpayHost should not be empty, vnpayHost must be a URL address',
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
                key: 'invalid_tenantId',
                summary: 'Tenant Id not found',
                detail: 'Tenant Id not found',
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
                summary: 'VNPay Config already exists',
                detail: 'VNPay Config already exists',
            },
        ],
    })
    async createVNPay(@Req() req: Request, @Body() data: CreateVNPayConfig) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantVNPayConfigService.CreateVNPayConfig({
            user: userData,
            ...data,
        } as CreateVNPayConfigRequestDTO);
    }

    @Get('find/:tenantId')
    // @UseGuards(AccessTokenGuard)
    // @ApiBearerAuth('JWT-access-token-user')
    // @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Find one VNPay Config by TenantID`,
        details: `
## Description
Find a VNPay Config by TenantId within a domain using an access token.
## Requirements
- **Access Token**: Must provide a valid access token.
    `,
    })
    @ApiParamExamples([
        {
            name: 'tenantId',
            description: 'ID of Tenant in DB',
            example: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
            required: true,
        },
    ])
    @ApiResponseExample(
        'read',
        'find a VNPay Config by tenantId',
        {
            vnpayConfig: {
                id: '496ba405-541f-4b3e-8567-edb3ddd9dfeb',
                tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                tmnCode: 'TMNCODEEXAMPLE',
                secureSecret: 'SECRETKEYEXAMPLE',
                vnpayHost: 'https://sandbox.vnpayment.vn',
            },
        },
        '/api/tenant/payment/vnpay/find/d4d98d4c-d2f4-4d91-a6e7-2555715ce144',
    )
    @ApiErrorResponses(
        '/api/tenant/payment/vnpay/find/:tenantId',
        '/api/tenant/payment/vnpay/find/496ba405-541f-4b3e-8567-edb3ddd9dfeb',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'tenantId must be a UUID',
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
                    summary: 'VNPay config not found',
                    detail: 'VNPay config not found',
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
    async findVNPayConfigByTenantId(
        @Req() req: Request,
        @Param() data: GetVNPayConfigByTenantIdRequestDTO,
    ) {
        // console.log(data);
        // const payloadToken = req['user'];
        // // const header = req.headers;
        // const userData = {
        //     email: payloadToken.email,
        //     domain: payloadToken.domain,
        //     role: payloadToken.role,
        //     accessToken: payloadToken.accessToken,
        // } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantVNPayConfigService.GetVNPayConfigByTenantId({
            ...data,
        } as GetVNPayConfigByTenantIdRequestDTO);
    }

    @Post('update')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Update a VNPay Config`,
        details: `
## Description
Update a VNPay Config within a domain using an access token. This operation is restricted to tenant accounts only.

## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
`,
    })
    @ApiBodyExample(UpdateVNPayConfig, {
        id: '496ba405-541f-4b3e-8567-edb3ddd9dfeb',
        tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
        tmnCode: 'CHANGEUPDATE',
    })
    @ApiResponseExample(
        'update',
        'update VNPay Config',
        {
            vnpayConfig: {
                id: '496ba405-541f-4b3e-8567-edb3ddd9dfeb',
                tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                tmnCode: 'CHANGEUPDATE',
                secureSecret: 'SECRETKEYEXAMPLE',
                vnpayHost: 'https://sandbox.vnpayment.vn',
            },
        },
        '/api/tenant/payment/vnpay/update',
    )
    @ApiErrorResponses('/api/tenant/payment/vnpay/update', '/api/tenant/payment/vnpay/update', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'id should not be empty, id must be a UUID, tenantId should not be empty, tenantId must be a UUID',
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
                summary: 'VNPay config not found',
                detail: 'VNPay config not found',
                error: 'Unauthorized',
            },
            {
                key: 'tenant_not_found',
                summary: 'Tenant Id not found',
                detail: 'Tenant Id not found',
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
    async updateVNPayConfig(@Req() req: Request, @Body() updateData: UpdateVNPayConfig) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantVNPayConfigService.UpdateVNPayConfig({
            user: userData,
            ...updateData,
        } as UpdateVNPayConfigRequestDTO);
    }

    @Delete('delete/:id')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Delete one VNPay Config by Id`,
        details: `
## Description
Delete a VNPay Config by Id within a domain using an access token. This operation is restricted to tenant accounts only.

## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level and user-level permissions.
`,
    })
    @ApiParamExamples([
        {
            name: 'id',
            description: 'ID of VNPay Config',
            example: '496ba405-541f-4b3e-8567-edb3ddd9dfeb',
            required: true,
        },
    ])
    @ApiResponseExample(
        'delete',
        'delete a VNPay Config by Id',
        {
            vnpayConfig: {
                id: '496ba405-541f-4b3e-8567-edb3ddd9dfeb',
                tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                tmnCode: 'CHANGEUPDATE',
                secureSecret: 'SECRETKEYEXAMPLE',
                vnpayHost: 'https://sandbox.vnpayment.vn',
            },
        },
        '/api/tenant/payment/vnpay/delete/496ba405-541f-4b3e-8567-edb3ddd9dfeb',
    )
    @ApiErrorResponses(
        '/api/tenant/payment/vnpay/delete/:id',
        '/api/tenant/payment/vnpay/delete/4ce1d0b3-7904-4ead-bcd9-97ceb351116a',
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
                    key: 'not_found',
                    summary: 'VNPay config not found',
                    detail: 'VNPay config not found',
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
    async deleteVNPayConfig(@Req() req: Request, @Param() data: DeleteVNPayConfig) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantVNPayConfigService.DeleteVNPayConfig({
            user: userData,
            ...data,
        } as DeleteVNPayConfigRequestDTO);
    }
}
