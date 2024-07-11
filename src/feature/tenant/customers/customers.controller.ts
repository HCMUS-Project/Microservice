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
    ApiQueryExamples,
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';
import { TenantCustomersService } from './customers.service';
import {
    GetAllBookingsOrdersNumbersRequestDTO,
    GetUsersReportByDate,
    GetUsersReportByDateRequestDTO,
} from './customers.dto.';

@Controller('tenant/customers')
@ApiTags('tenant/customers')
export class CustomersController {
    constructor(
        @Inject('GRPC_TENANT_SERVICE_CUSTOMERS')
        private readonly tenantCustomersService: TenantCustomersService,
    ) {}

    @Get('report')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Find one Policy and Term by TenantID`,
        details: `
## Description
Find a Policy and Term by TenantId within a domain.
## Requirements 
`,
    })
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
    async getAllBookingsOrders(@Req() req: Request) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantCustomersService.getAllBookingsOrdersNumbers({
            user: userData,
        } as GetAllBookingsOrdersNumbersRequestDTO);
    }

    @Get('quantity')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Get Report of Number of User by condition`,
        details: `
## Description
Find a
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
- **type**: Must is a valid type 
`,
    })
    @ApiQueryExamples([
        {
            name: 'type',
            description: 'Get Report of User in Tenant by type',
            example: 'YEAR',
            required: true,
        },
    ])
    @ApiResponseExample(
        'read',
        'find all Number of User in Domain by type date',
        {
            reports: [
                {
                    type: 'Thursday',
                    totalUsers: 1,
                },
            ],
            total: 1,
        },
        '/api/tenant/customers/quantity/?type=WEEK',
    )
    @ApiErrorResponses(
        '/api/tenant/customers/quantity/',
        '/api/tenant/customers/quantity/?type=WEEK',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'type should not be empty, Must be a valid Order Type: WEEK, YEAR, type must be a string',
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
            ],
        },
    )
    async getUsersReportByDate(
        @Req() req: Request,
        @Query()
        query: GetUsersReportByDate,
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
        return await this.tenantCustomersService.getUsersReportByDate({
            user: userData,
            ...query,
        } as GetUsersReportByDateRequestDTO);
    }
}
