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
import { TenantPolictyAndTermService } from './policyAndTerm.service';
import {
    CreatePolicyAndTerm,
    CreatePolicyAndTermRequestDTO,
    DeletePolicyAndTerm,
    DeletePolicyAndTermRequestDTO,
    FindPolicyAndTermByTenantId,
    FindPolicyAndTermByTenantIdRequestDTO,
    UpdatePolicyAndTerm,
    UpdatePolicyAndTermRequestDTO,
} from './policyAndTerm.dto';

@Controller('tenant/policy')
@ApiTags('tenant/policy')
export class PolicyAndTermController {
    constructor(
        @Inject('GRPC_TENANT_SERVICE_POLICY')
        private readonly tenantPolictyAndTermService: TenantPolictyAndTermService,
    ) {}

    @Post('create')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Create a Policy and Term`,
        details: `
## Description
Create a policy and term within a domain using an access token. This operation is restricted to tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
`,
    })
    @ApiBodyExample(CreatePolicyAndTerm, {
        tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
        policy: 'policy gi do ',
        term: 'term gi do',
    })
    @ApiResponseExample(
        'create',
        'create Policy and Term',
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
        '/api/tenant/policy/create',
    )
    @ApiErrorResponses('/api/tenant/policy/create', '/api/tenant/policy/create', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'tenantId should not be empty, tenantId must be a UUID, policy should not be empty, policy must be a string, term should not be empty, term must be a string',
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
                summary: 'Policy and term already exists',
                detail: 'Policy and term already exists',
            },
            {
                key: 'invalid_tenantId',
                summary: 'Invalid tenant id',
                detail: 'Invalid tenant id',
            },
        ],
    })
    async createPolicyAndTerm(@Req() req: Request, @Body() data: CreatePolicyAndTerm) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantPolictyAndTermService.createPolicyAndTerm({
            user: userData,
            ...data,
        } as CreatePolicyAndTermRequestDTO);
    }

    @Get('find/:tenantId')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
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
    async findPolicyAndTermByTenantId(
        @Req() req: Request,
        @Param() data: FindPolicyAndTermByTenantId,
    ) {
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
        return await this.tenantPolictyAndTermService.findPolicyAndTermByTenantId({
            user: userData,
            ...data,
        } as FindPolicyAndTermByTenantIdRequestDTO);
    }

    @Post('update')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Update a Policy and Term`,
        details: `
    ## Description
Update a Policy and Term within a domain using an access token. This operation is restricted to tenant accounts only.

## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
        `,
    })
    @ApiBodyExample(UpdatePolicyAndTerm, {
        id: '4ce1d0b3-7904-4ead-bcd9-97ceb351116a',
        tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
        policy: 'change policy to test',
    })
    @ApiResponseExample(
        'update',
        'update Policy and Term',
        {
            policyAndTerm: {
                id: '4ce1d0b3-7904-4ead-bcd9-97ceb351116a',
                tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                policy: 'change policy to test',
                term: 'term gi do',
                createdAt: '2024-05-21T18:33:07.638Z',
                updatedAt: '2024-05-22T03:20:25.064Z',
            },
        },
        '/api/tenant/policy/update',
    )
    @ApiErrorResponses('/api/tenant/policy/update', '/api/tenant/policy/update', {
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
    })
    async updatePolicyAndTerm(@Req() req: Request, @Body() updateData: UpdatePolicyAndTerm) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantPolictyAndTermService.updatePolicyAndTerm({
            user: userData,
            ...updateData,
        } as UpdatePolicyAndTermRequestDTO);
    }

    @Delete('delete/:id')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Delete one Policy and Term by Id`,
        details: `
## Description
Delete a Policy and Term by Id within a domain using an access token. This operation is restricted to tenant accounts only.

## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level and user-level permissions.
        `,
    })
    @ApiParamExamples([
        {
            name: 'id',
            description: 'ID of Policy and Term',
            example: '4ce1d0b3-7904-4ead-bcd9-97ceb351116a',
            required: true,
        },
    ])
    @ApiResponseExample(
        'delete',
        'delete a Policy and Term by Id',
        {
            policyAndTerm: {
                id: '4ce1d0b3-7904-4ead-bcd9-97ceb351116a',
                tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                policy: 'change policy to test',
                term: 'term gi do',
                createdAt: '2024-05-21T18:33:07.638Z',
                updatedAt: '2024-05-22T03:20:25.064Z',
            },
        },
        '/api/tenant/policy/delete/8fbdf728-dd73-4003-8a6a-4434186c6391',
    )
    @ApiErrorResponses(
        '/api/tenant/policy/delete/:id',
        '/api/tenant/policy/delete/8fbdf728-dd73-4003-8a6a-4434186c6391',
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
    async DeletePolicyAndTerm(@Req() req: Request, @Param() data: DeletePolicyAndTerm) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantPolictyAndTermService.deletePolicyAndTerm({
            user: userData,
            ...data,
        } as DeletePolicyAndTermRequestDTO);
    }
}
