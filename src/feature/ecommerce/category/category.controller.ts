import { Body, Controller, Delete, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
} from '@nestjs/swagger';
import { EcommerceCategoryService } from './category.service';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { RolesGuard } from 'src/common/guards/role/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import {
    CreateCategory,
    CreateCategoryRequestDTO,
    FindAllCategoriesRequestDTO,
    FindOneCategory,
    FindOneCategoryRequestDTO,
    RemoveCategory,
    RemoveCategoryRequestDTO,
    UpdateCategory,
    UpdateCategoryRequestDTO,
} from './category.dto';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import {
    ApiBodyExample,
    ApiEndpoint,
    ApiErrorResponses,
    ApiQueryExamples,
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';

@Controller('/ecommerce/category')
@ApiTags('ecommerce/category')
export class CategoryController {
    constructor(
        @Inject('GRPC_ECOMMERCE_SERVICE_CATEGORY')
        private readonly ecommerceCategoryService: EcommerceCategoryService,
    ) {}

    @Post('create')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Create a category`,
        details: `
## Description
Create a category within a domain using an access token. This operation is restricted to tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
`,
    })
    @ApiBodyExample(CreateCategory, {
        name: 'Esport',
        description: 'Lien Minh Huyen Thoai',
    })
    @ApiResponseExample(
        'create',
        'create Category',
        {
            id: '6553fcfc-f8ad-400c-971f-dfd2670193d2',
            name: 'Esport',
        },
        '/api/ecommerce/category/create',
    )
    @ApiErrorResponses('/api/ecommerce/category/create', '/api/ecommerce/category/create', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'name should not be empty, description should not be empty',
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
                key: 'already_exists',
                summary: 'Category already exists',
                detail: 'Category already exists',
            },
        ],
    })
    async createCategory(@Req() req: Request, @Body() dataCategory: CreateCategory) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceCategoryService.createCategory({
            user: userData,
            ...dataCategory,
        } as CreateCategoryRequestDTO);
    }

    @Get('find/all')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Find all Categories`,
        details: `
## Description
Return all categories within a domain using an access token.  
        
## Requirements
- **Access Token**: Must provide a valid tenant access token. 
`,
    })
    @ApiResponseExample(
        'read',
        'find all categories',
        {
            categories: [
                {
                    id: '58e6613d-41b0-4f31-93cf-91a211b12c9c',
                    name: 'Kem chong nang',
                    description: 'Kem chong nang gi do',
                    createdAt: {
                        low: 1893381955,
                        high: 399,
                        unsigned: false,
                    },
                    domain: '30shine.com',
                    totalProducts: 2,
                },
                {
                    id: 'a09716f7-7b6e-4d29-a26f-ed3f321df4c9',
                    name: 'Sách vở',
                    description: 'Sách vở học tâp',
                    createdAt: {
                        low: 1921856393,
                        high: 399,
                        unsigned: false,
                    },
                    domain: '30shine.com',
                    totalProducts: 0,
                },
            ],
        },
        '/api/ecommerce/category/find/all',
    )
    @ApiErrorResponses('/api/ecommerce/category/find/all', '/api/ecommerce/category/find/all', {
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
    async findAllCategory(@Req() req: Request) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceCategoryService.findAllCategories({
            user: userData,
        } as FindAllCategoriesRequestDTO);
    }

    @Get('find/:id')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Find one category by ID`,
        details: `
## Description
Find a category within a domain using an access token.
## Requirements
- **Access Token**: Must provide a valid tenant access token.
`,
    })
    @ApiQueryExamples([
        {
            name: 'id',
            description: 'ID of category in DB',
            example: '58e6613d-41b0-4f31-93cf-91a211b12c9c',
            required: true,
        },
    ])
    @ApiResponseExample(
        'read',
        'find a category by Id',
        {
            id: '58e6613d-41b0-4f31-93cf-91a211b12c9c',
            name: 'Kem chong nang',
            description: 'Kem chong nang gi do',
            createdAt: {
                low: 1893381955,
                high: 399,
                unsigned: false,
            },
            domain: '30shine.com',
            totalProducts: 2,
        },
        '/api/ecommerce/category/find/58e6613d-41b0-4f31-93cf-91a211b12c9c',
    )
    @ApiErrorResponses(
        '/api/ecommerce/category/find/:id',
        '/api/ecommerce/category/find/3bb423de-2b81-4526-a1d3-9c3ca84633df',
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
                    key: 'category_not_found',
                    summary: 'Category not found',
                    detail: 'Category not found',
                    error: 'Unauthorized',
                },
            ],
        },
    )
    async findOneCategory(@Req() req: Request, @Param() data: FindOneCategory) {
        console.log(data);
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceCategoryService.findOneCategory({
            user: userData,
            ...data,
        } as FindOneCategoryRequestDTO);
    }

    @Post('update')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Update a category`,
        details: `
## Description
Update a category within a domain using an access token. This operation is restricted to tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
`,
    })
    @ApiBodyExample(UpdateCategory, {
        id: '93f55388-cd92-4f76-8ece-60fcf16f6806',
        name: 'SKinCare Khang oi',
        description: 'Khang oi sorry nhe hoi lau',
    })
    @ApiResponseExample(
        'update',
        'update Category',
        {
            id: '93f55388-cd92-4f76-8ece-60fcf16f6806',
            name: 'SKinCare Khang oi',
        },
        '/api/ecommerce/category/update',
    )
    @ApiErrorResponses('/api/ecommerce/category/update', '/api/ecommerce/category/update', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'id should not be empty, id must be a UUID, name should not be empty, description should not be empty',
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
                key: 'category_not_found',
                summary: 'Category not found',
                detail: 'Category not found',
                error: 'Unauthorized',
            },
        ],
    })
    async updateCategory(@Req() req: Request, @Body() updateCategory: UpdateCategory) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceCategoryService.updateCategory({
            user: userData,
            ...updateCategory,
        } as UpdateCategoryRequestDTO);
    }

    @Delete('delete/:id')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Delete one category by ID`,
        details: `
## Description
Delete a category within a domain using an access token. This operation is restricted to tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level and user-level permissions.
`,
    })
    @ApiQueryExamples([
        {
            name: 'id',
            description: 'ID of the category',
            example: 'eefdb88b-de10-4d14-b1a9-b762ffb0982a',
            required: true,
        },
    ])
    @ApiResponseExample(
        'delete',
        'delete a category by Id',
        {
            result: 'success',
        },
        '/api/ecommerce/category/delete/93f55388-cd92-4f76-8ece-60fcf16f6806',
    )
    @ApiErrorResponses(
        '/api/ecommerce/category/delete/:id',
        '/api/ecommerce/category/delete/93f55388-cd92-4f76-8ece-60fcf16f6806',
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
                    key: 'category_not_found',
                    summary: 'Category not found',
                    detail: 'Category not found',
                    error: 'Unauthorized',
                },
            ],
        },
    )
    async deleteCategory(@Req() req: Request, @Param() data: RemoveCategory) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceCategoryService.removeCategory({
            user: userData,
            ...data,
        } as RemoveCategoryRequestDTO);
    }
}
