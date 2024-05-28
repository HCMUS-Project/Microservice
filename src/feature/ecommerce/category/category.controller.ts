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
import { EcommerceCategoryService } from './category.service';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { RolesGuard } from 'src/common/guards/role/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import {
    CreateCategory,
    CreateCategoryRequestDTO,
    FindAllCategoriesRequestDTO,
    FindCategory,
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
    ApiParamExamples,
    ApiQueryExamples,
    ApiResponseExample,
    ApiResponseReadExample,
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
                key: 'forbidden_resource',
                summary: 'Forbidden resource',
                detail: 'Forbidden resource',
            },
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

    @Get('find')
    @ApiEndpoint({
        summary: `Find Categories`,
        details: `
## Description
Return all categories within a domain.  

## Requirement
- Use only **domain** to find all Categories.
- Use **domain** and **id** to find only one Category
`,
    })
    @ApiQueryExamples([
        {
            name: 'domain',
            description: 'domain of Category',
            example: '30shine.com',
            required: true,
        },
        {
            name: 'id',
            description: 'id of Category in Db',
            example: '4432abc7-7ef1-4517-9a90-a97ca51691fa',
            required: false,
        },
    ])
    @ApiResponseReadExample('Categories', {
        getAll: {
            data: {
                categories: [
                    {
                        id: '4432abc7-7ef1-4517-9a90-a97ca51691fa',
                        name: 'Sách vở',
                        description: 'Sách vở học tâp',
                        createdAt: {
                            low: 2145213018,
                            high: 399,
                            unsigned: false,
                        },
                        domain: '30shine.com',
                        totalProducts: 1,
                    },
                    {
                        id: 'b382de76-b34b-4321-ad43-840439bc24c4',
                        name: 'Dưỡng da',
                        description: 'Cho dồ dưỡng da',
                        createdAt: {
                            low: 2145238845,
                            high: 399,
                            unsigned: false,
                        },
                        domain: '30shine.com',
                        totalProducts: 1,
                    },
                ],
            },
            path: '/api/ecommerce/category/find/?domain=30shine.com',
        },
        findOne: {
            data: {
                id: '4432abc7-7ef1-4517-9a90-a97ca51691fa',
                name: 'Sách vở',
                description: 'Sách vở học tâp',
                createdAt: {
                    low: 2145213018,
                    high: 399,
                    unsigned: false,
                },
                domain: '30shine.com',
                totalProducts: 1,
            },
            path: '/api/ecommerce/category/find/?domain=30shine.com&id=4432abc7-7ef1-4517-9a90-a97ca51691fa',
        },
    })
    @ApiErrorResponses(
        '/api/ecommerce/category/find/?domain=&id=',
        '/api/ecommerce/category/find/?domain=30shine.com&id=4432abc7-7ef1-4517-9a90-a97ca51691fa',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'id must be a UUID, domain should not be empty, domain must be a URL address',
            },
            unauthorized: [
                {
                    key: 'category_not_found',
                    summary: 'Category not found',
                    detail: 'Category not found',
                    error: 'Unauthorized',
                },
            ],
        },
    )
    async findCategory(@Req() req: Request, @Query() data: FindCategory) {
        if (data.id === undefined) {
            return await this.ecommerceCategoryService.findAllCategories({
                domain: data.domain,
            } as FindAllCategoriesRequestDTO);
        } else {
            return await this.ecommerceCategoryService.findOneCategory({
                ...data,
            } as FindOneCategoryRequestDTO);
        }
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
        forbidden: [
            {
                key: 'forbidden_resource',
                summary: 'Forbidden resource',
                detail: 'Forbidden resource',
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
    @ApiParamExamples([
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
            forbidden: [
                {
                    key: 'forbidden_resource',
                    summary: 'Forbidden resource',
                    detail: 'Forbidden resource',
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
