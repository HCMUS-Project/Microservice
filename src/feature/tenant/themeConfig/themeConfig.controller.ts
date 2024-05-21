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
    ApiQueryExamples,
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';
import { TenantThemeConfigService } from './themeConfig.service';
import {
    CreateThemeConfig,
    CreateThemeConfigRequestDTO,
    DeleteThemeConfig,
    DeleteThemeConfigRequestDTO,
    FindThemeConfigByTenantId,
    FindThemeConfigByTenantIdRequestDTO,
    UpdateThemeConfig,
    UpdateThemeConfigRequestDTO,
} from './themeConfig.dto';

@Controller('tenant/configTheme')
@ApiTags('tenant/configTheme')
export class ThemeConfigController {
    constructor(
        @Inject('GRPC_TENANT_SERVICE_THEME_CONFIG')
        private readonly tenantThemeConfigService: TenantThemeConfigService,
    ) {}

    @Post('create')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Create a theme config`,
        details: `
## Description
Create a them config within a domain using an access token. This operation is restricted to tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
`,
    })
    @ApiBodyExample(CreateThemeConfig, {
        tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
        headerColor: '#512647',
        headerTextColor: '#F3AEDE',
        bodyColor: '#F3AEDE',
        bodyTextColor: '#F3AEDE',
        footerColor: '#F3AEDE',
        footerTextColor: '#F3AEDE',
        textFont: '#F3AEDE',
        buttonColor: '#F3AEDE',
        buttonTextColor: '#F3AEDE',
        buttonRadius: 15,
    })
    @ApiResponseExample(
        'create',
        'create Theme Config',
        {
            themeConfig: {
                id: 'a138dbc2-4386-4eb8-a208-50921d9abf24',
                tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                headerColor: '#512647',
                headerTextColor: '#F3AEDE',
                bodyColor: '#F3AEDE',
                bodyTextColor: '#F3AEDE',
                footerColor: '#F3AEDE',
                footerTextColor: '#F3AEDE',
                textFont: '#F3AEDE',
                buttonColor: '#F3AEDE',
                buttonTextColor: '#F3AEDE',
                buttonRadius: 15,
                createdAt: '2024-05-21T12:42:16.710Z',
                updatedAt: '2024-05-21T12:42:16.710Z',
            },
        },
        '/api/tenant/configTheme/create',
    )
    @ApiErrorResponses('/api/tenant/configTheme/create', '/api/tenant/configTheme/create', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'tenantId should not be empty, tenantId must be a UUID, headerColor should not be empty, headerColor must be a hexadecimal color, headerTextColor should not be empty, headerTextColor must be a hexadecimal color, bodyColor should not be empty, bodyColor must be a hexadecimal color, bodyTextColor should not be empty, bodyTextColor must be a hexadecimal color, footerColor should not be empty, footerColor must be a hexadecimal color, footerTextColor should not be empty, footerTextColor must be a hexadecimal color, textFont should not be empty, textFont must be a string, buttonColor should not be empty, buttonColor must be a hexadecimal color, buttonTextColor should not be empty, buttonTextColor must be a hexadecimal color, buttonRadius should not be empty, buttonRadius must be a positive number',
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
                summary: 'Theme config already exists',
                detail: 'Theme config already exists',
            },
            {
                key: 'invalid_tenantId',
                summary: 'Invalid tenant id',
                detail: 'Invalid tenant id',
            },
        ],
    })
    async createThemeConfig(@Req() req: Request, @Body() data: CreateThemeConfig) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantThemeConfigService.createThemeConfig({
            user: userData,
            ...data,
        } as CreateThemeConfigRequestDTO);
    }

    @Get('find/:tenantId')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Find one Theme Config by TenantID`,
        details: `
## Description
Find a Theme Config by TenantId within a domain using an access token.
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
        'find a Theme Config by tenantId',
        {
            themeConfig: {
                id: 'fa12d7b4-2411-4df5-a7e4-d23c7e47f3d6',
                tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                headerColor: '#161D3A',
                headerTextColor: '#F3AEDE',
                bodyColor: '#F3AEDE',
                bodyTextColor: '#F3AEDE',
                footerColor: '#F3AEDE',
                footerTextColor: '#F3AEDE',
                textFont: '#F3AEDE',
                buttonColor: '#F3AEDE',
                buttonTextColor: '#F3AEDE',
                buttonRadius: 15,
                createdAt: '2024-05-21T12:46:12.815Z',
                updatedAt: '2024-05-21T12:46:12.815Z',
            },
        },
        '/api/tenant/configTheme/find/d4d98d4c-d2f4-4d91-a6e7-2555715ce144',
    )
    @ApiErrorResponses(
        '/api/tenant/configTheme/find/:tenantId',
        '/api/tenant/configTheme/find/d4d98d4c-d2f4-4d91-a6e7-2555715ce144',
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
                    summary: 'Theme config not found',
                    detail: 'Theme config not found',
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
    async findThemeConfigByTenantId(@Req() req: Request, @Param() data: FindThemeConfigByTenantId) {
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
        return await this.tenantThemeConfigService.findThemeConfigByTenantId({
            user: userData,
            ...data,
        } as FindThemeConfigByTenantIdRequestDTO);
    }

    @Post('update')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Update a theme config`,
        details: `
    ## Description
Update a theme config within a domain using an access token. This operation is restricted to tenant accounts only.

## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
        `,
    })
    @ApiBodyExample(UpdateThemeConfig, {
        id: 'fa12d7b4-2411-4df5-a7e4-d23c7e47f3d6',
        tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
        headerColor: '#B68FA9',
    })
    @ApiResponseExample(
        'update',
        'update Theme Config',
        {
            themeConfig: {
                id: 'fa12d7b4-2411-4df5-a7e4-d23c7e47f3d6',
                tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                headerColor: '#B68FA9',
                headerTextColor: '#F3AEDE',
                bodyColor: '#F3AEDE',
                bodyTextColor: '#F3AEDE',
                footerColor: '#F3AEDE',
                footerTextColor: '#F3AEDE',
                textFont: '#F3AEDE',
                buttonColor: '#F3AEDE',
                buttonTextColor: '#F3AEDE',
                buttonRadius: 15,
                createdAt: '2024-05-21T12:46:12.815Z',
                updatedAt: '2024-05-21T13:02:28.522Z',
            },
        },
        '/api/tenant/configTheme/update',
    )
    @ApiErrorResponses('/api/tenant/configTheme/update', '/api/tenant/configTheme/update', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'id should not be empty, id must be a UUID, tenantId should not be empty, tenantId must be a UUID, headerColor must be a hexadecimal color, headerTextColor must be a hexadecimal color, bodyColor must be a hexadecimal color, bodyTextColor must be a hexadecimal color, footerColor must be a hexadecimal color, footerTextColor must be a hexadecimal color, buttonColor must be a hexadecimal color, buttonTextColor must be a hexadecimal color',
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
                summary: 'Theme config not found',
                detail: 'Theme config not found',
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
    async updateThemeConfig(@Req() req: Request, @Body() updateData: UpdateThemeConfig) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantThemeConfigService.updateThemeConfig({
            user: userData,
            ...updateData,
        } as UpdateThemeConfigRequestDTO);
    }

    @Delete('delete/:id')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Delete one Theme Config by Id`,
        details: `
## Description
Delete a Theme Config by Id within a domain using an access token. This operation is restricted to tenant accounts only.

## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level and user-level permissions.
        `,
    })
    @ApiParamExamples([
        {
            name: 'id',
            description: 'ID of Theme Config',
            example: 'fa12d7b4-2411-4df5-a7e4-d23c7e47f3d6',
            required: true,
        },
    ])
    @ApiResponseExample(
        'delete',
        'delete a Theme Config by Id',
        {
            themeConfig: {
                id: 'fa12d7b4-2411-4df5-a7e4-d23c7e47f3d6',
                tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                headerColor: '#B68FA9',
                headerTextColor: '#F3AEDE',
                bodyColor: '#F3AEDE',
                bodyTextColor: '#F3AEDE',
                footerColor: '#F3AEDE',
                footerTextColor: '#F3AEDE',
                textFont: '#F3AEDE',
                buttonColor: '#F3AEDE',
                buttonTextColor: '#F3AEDE',
                buttonRadius: 15,
                createdAt: '2024-05-21T12:46:12.815Z',
                updatedAt: '2024-05-21T13:02:28.522Z',
            },
        },
        '/api/tenant/configTheme/delete/fa12d7b4-2411-4df5-a7e4-d23c7e47f3d6',
    )
    @ApiErrorResponses(
        '/api/tenant/configTheme/delete/:id',
        '/api/tenant/configTheme/delete/fa12d7b4-2411-4df5-a7e4-d23c7e47f3d5',
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
                    summary: 'Theme config not found',
                    detail: 'Theme config not found',
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
    async deleteThemeConfig(@Req() req: Request, @Param() data: DeleteThemeConfig) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.tenantThemeConfigService.deleteThemeConfig({
            user: userData,
            ...data,
        } as DeleteThemeConfigRequestDTO);
    }
}
