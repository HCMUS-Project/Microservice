import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
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
import { PaymentPaymentMethodService } from './paymentMethod.service';
import {
    CreatePaymentMethod,
    CreatePaymentMethodRequestDTO,
    DeletePaymentMethod,
    DeletePaymentMethodRequestDTO,
    GetPaymentMethod,
    GetPaymentMethodRequestDTO,
    ListPaymentMethodRequestDTO,
    UpdatePaymentMethod,
    UpdatePaymentMethodRequestDTO,
} from './paymentMethod.dto';
import { GetPaymentMethodRequest } from 'src/proto_build/payment/paymentMethod/GetPaymentMethodRequest';

@Controller('payment/method')
@ApiTags('payment/method')
export class PaymentMethodController {
    constructor(
        @Inject('GRPC_PAYMENT_SERVICE_PAYMENT_METHOD')
        private readonly paymentPaymentMethodService: PaymentPaymentMethodService,
    ) {}

    @Post('create')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Create a Payment Method`,
        details: `
## Description
Create a Payment Method within a domain using an access token. This operation is restricted to tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
- **status** is optional
`,
    })
    @ApiBodyExample(CreatePaymentMethod, { type: 'vnpay', status: false })
    @ApiResponseExample(
        'create',
        'create Payment Method',
        {
            id: 'cbb2345d-90b9-43a0-93c7-a85b63706273',
            type: 'vnpay',
            status: false,
            domain: '30shine.com',
        },
        '/api/payment/method/create',
    )
    @ApiErrorResponses('/api/payment/method/create', '/api/payment/method/create', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'type should not be empty, type must be a string',
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
    })
    async createPaymentMethod(@Req() req: Request, @Body() data: CreatePaymentMethod) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.paymentPaymentMethodService.createPaymentMethod({
            user: userData,
            ...data,
        } as CreatePaymentMethodRequestDTO);
    }

    @Get('find/all')
    @UseGuards(AccessTokenGuard)
    // @Roles(Role.TENANT)
    // @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Find all payment method by Domain within tenant access`,
        details: `
## Description
Find all Payment Method within a domain using an access token. 
`,
    })
    @ApiResponseExample(
        'read',
        'list all Payment Method',
        {
            paymentMethods: [
                {
                    id: 'ccc48411-812b-43f9-8742-8a9df827462a',
                    type: 'vnpay',
                    status: true,
                    domain: '30shine.com',
                },
                {
                    id: '1240400b-7674-4cfd-a2b7-2d8a8ed2af61',
                    type: 'zalopay',
                    status: false,
                    domain: '30shine.com',
                },
            ],
        },
        '/api/payment/method/find/all',
    )
    async findAllPaymentMethod(@Req() req: Request) {
        // console.log(data);
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        console.log('abc');
        // console.log(userData, dataCategory)
        return await this.paymentPaymentMethodService.listPaymentMethod({
            user: userData,
        } as ListPaymentMethodRequestDTO);
    }

    @Get('find/:id')
    @UseGuards(AccessTokenGuard)
    // @Roles(Role.TENANT)
    // @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Find one Payment Method by ID`,
        details: `
## Description
Find a Payment Method by Id within a domain using an access token.
## Requirements
- **Access Token**: Must provide a valid access token.
        `,
    })
    @ApiParamExamples([
        {
            name: 'id',
            description: 'ID of Tenant in DB',
            example: 'ccc48411-812b-43f9-8742-8a9df827462a',
            required: true,
        },
    ])
    @ApiResponseExample(
        'read',
        'find a Payment Method by id',
        {
            id: 'ccc48411-812b-43f9-8742-8a9df827462a',
            type: 'vnpay',
            status: true,
            domain: '30shine.com',
        },
        '/api/payment/method/find/ccc48411-812b-43f9-8742-8a9df827462a',
    )
    @ApiErrorResponses(
        '/api/payment/method/find/ccc48411-812b-43f9-8742-8a9df827462a',
        '/api/payment/method/find/ccc48411-812b-43f9-8742-8a9df827462a',
        {
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
                    key: 'not_found',
                    summary: 'Payment method not found',
                    detail: 'Payment method not found',
                },
            ],
        },
    )
    async findOnePaymentMethod(@Req() req: Request, @Param() data: GetPaymentMethod) {
        // console.log(data);
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.paymentPaymentMethodService.getPaymentMethod({
            user: userData,
            ...data,
        } as GetPaymentMethodRequestDTO);
    }

    @Post('update')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Update a Payment Method`,
        details: `
    ## Description
Update a Payment Method within a domain using an access token. This operation is restricted to tenant accounts only.

## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
        `,
    })
    @ApiBodyExample(UpdatePaymentMethod, {
        id: 'ccc48411-812b-43f9-8742-8a9df827462a',
        status: false,
    })
    @ApiResponseExample(
        'update',
        'update a Payment Method',
        {
            id: 'ccc48411-812b-43f9-8742-8a9df827462a',
            type: 'vnpay',
            status: false,
            domain: '30shine.com',
        },
        '/api/payment/method/update',
    )
    @ApiErrorResponses('/api/payment/method/update', '/api/payment/method/update', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'id should not be empty, id must be a UUID, status must be a boolean value',
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
                key: 'not_found',
                summary: 'Payment method not found',
                detail: 'Payment method not found',
            },
        ],
    })
    async updatePaymentMethod(@Req() req: Request, @Body() updateData: UpdatePaymentMethod) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.paymentPaymentMethodService.updatePaymentMethod({
            user: userData,
            ...updateData,
        } as UpdatePaymentMethodRequestDTO);
    }

    @Delete('delete/:id')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Delete a Payment Method`,
        details: `
## Description
Delete a Payment Method by Id within a domain using an access token. This operation is restricted to tenant accounts only.

## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level and user-level permissions.
        `,
    })
    @ApiParamExamples([
        {
            name: 'id',
            description: 'ID of a Payment Method',
            example: 'ccc48411-812b-43f9-8742-8a9df827462a',
            required: true,
        },
    ])
    @ApiResponseExample(
        'delete',
        'delete a a Payment Method by Id',
        { result: 'success' },
        '/api/payment/method/delete/ccc48411-812b-43f9-8742-8a9df827462a',
    )
    @ApiErrorResponses(
        '/api/payment/method/delete/:id',
        '/api/payment/method/delete/ccc48411-812b-43f9-8742-8a9df827462a',
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
                    key: 'not_found',
                    summary: 'Payment method not found',
                    detail: 'Payment method not found',
                },
            ],
        },
    )
    async deletePaymentMethod(@Req() req: Request, @Param() data: DeletePaymentMethod) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.paymentPaymentMethodService.deletePaymentMethod({
            user: userData,
            ...data,
        } as DeletePaymentMethodRequestDTO);
    }
}
