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
import {PaymentBankService} from './bank.service';
import {ListBankResquest} from 'src/proto_build/payment/bank/ListBankResquest';

@Controller('payment/bank')
@ApiTags('payment/bank')
export class BankController {
    constructor(
        @Inject('GRPC_PAYMENT_SERVICE_BANK')
        private readonly paymentBankService: PaymentBankService,
    ) {}

    @Get('find')
    @ApiEndpoint({
        summary: `Find one Policy and Term by TenantID`,
        details: `
## Description
Find a Policy and Term by TenantId within a domain using an access token.
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
        'find a Policy and Term by tenantId',
        {
            policyAndTerm: {
                id: '4ce1d0b3-7904-4ead-bcd9-97ceb351116a',
                tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                policy: 'policy gi do ',
                term: 'term gi do',
                createdAt: '2024-05-21T18:33:07.638Z',
                updatedAt: '2024-05-21T18:33:07.638Z',
            },
        },
        '/api/tenant/policy/find/d4d98d4c-d2f4-4d91-a6e7-2555715ce144',
    )
    @ApiErrorResponses(
        '/api/tenant/policy/find/:tenantId',
        '/api/tenant/policy/find/d4d98d4c-d2f4-4d91-a6e7-2555715ce144',
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
                    summary: 'Policy and term not found',
                    detail: 'Policy and term not found',
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
    async findBank(
        @Req() req: Request,
        @Param() data: ListBankResquest,
    ) {
        return await this.paymentBankService.getBank({
            ...data,
        } as ListBankResquest);
    }
}
