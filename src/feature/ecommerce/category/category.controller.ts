import { Body, Controller, Delete, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
    ApiUnauthorizedResponse,
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
    FindOneCategoryRequestDTO,
    RemoveCategoryRequestDTO,
    UpdateCategory,
    UpdateCategoryRequestDTO,
} from './category.dto';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { UpdateProfileDto } from 'src/feature/auth/profile/profile.dto';

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
    @ApiOperation({
        summary: 'Create category of domain',
        description: `
## Use access token
## Must use tenant account`,
    })
    @ApiBody({
        type: CreateCategory,
        examples: {
            category_1: {
                value: {
                    name: 'Esport',
                    description: 'Lien Minh Huyen Thoai',
                } as CreateCategory,
            },
        },
    })
    @ApiCreatedResponse({
        description: 'Create category successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after Create category successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-05-02T10:51:03.295Z',
                            path: '/api/ecommerce/category/create',
                            message: null,
                            error: null,
                            data: {
                                id: '6553fcfc-f8ad-400c-971f-dfd2670193d2',
                                name: 'Esport',
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Authorization failed',
        content: {
            'application/json': {
                examples: {
                    token_not_verified: {
                        summary: 'Token not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-27T12:31:30.700Z',
                            path: '/api/ecommerce/category/create',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                    unauthorized_role: {
                        summary: 'Role not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-27T12:31:30.700Z',
                            path: '/api/ecommerce/category/create',
                            message: 'Unauthorized Role',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                    token_not_found: {
                        summary: 'Token not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-02T10:55:28.511Z',
                            path: '/api/ecommerce/category/create',
                            message: 'Access Token not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
        content: {
            'application/json': {
                examples: {
                    user_not_verified: {
                        summary: 'Category already exists',
                        value: {
                            statusCode: 403,
                            timestamp: '2024-05-02T11:24:03.152Z',
                            path: '/api/ecommerce/category/create',
                            message: 'Category already exists',
                            error: 'Forbidden',
                            data: null,
                        },
                    },
                },
            },
        },
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
    @ApiOperation({
        summary: 'Find all categories',
        description: `
## Use access token`,
    })
    @ApiCreatedResponse({
        description: 'Get all categories successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after get all categories successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-02T11:29:59.962Z',
                            path: '/api/ecommerce/category/find/all',
                            message: null,
                            error: null,
                            data: {
                                categories: [
                                    {
                                        id: '93f55388-cd92-4f76-8ece-60fcf16f6806',
                                        name: 'Cosmestic',
                                        description:
                                            'Using for make beauty and hahahaahahaha haahaa',
                                        createdAt: {
                                            low: 528503348,
                                            high: 399,
                                            unsigned: false,
                                        },
                                        domain: '30shine.com',
                                    },
                                    {
                                        id: '840316ea-7675-4c18-8a40-795ee361b5b5',
                                        name: 'Learning',
                                        description: 'Learning many thing',
                                        createdAt: {
                                            low: 533115864,
                                            high: 399,
                                            unsigned: false,
                                        },
                                        domain: '30shine.com',
                                    },
                                    {
                                        id: '1decb08d-1aee-4aba-a0a8-9b039d9072f6',
                                        name: 'Skincare00000',
                                        description: 'Skin care will 0000 fun',
                                        createdAt: {
                                            low: 553990192,
                                            high: 399,
                                            unsigned: false,
                                        },
                                        domain: '30shine.com',
                                    },
                                    {
                                        id: '6553fcfc-f8ad-400c-971f-dfd2670193d2',
                                        name: 'Esport',
                                        description: 'Lien Minh Huyen Thoai',
                                        createdAt: {
                                            low: 955112174,
                                            high: 399,
                                            unsigned: false,
                                        },
                                        domain: '30shine.com',
                                    },
                                ],
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Authorization failed',
        content: {
            'application/json': {
                examples: {
                    token_not_verified: {
                        summary: 'Token not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-02T11:30:43.976Z',
                            path: '/api/ecommerce/category/find/all',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                },
            },
        },
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
    @ApiOperation({
        summary: 'Find one category',
        description: `
## Use access token
## Use id to path`,
    })
    @ApiParam({
        name: 'id',
        description: 'ID of category in DB',
        example: '93f55388-cd92-4f76-8ece-60fcf16f6806',
        required: true,
    })
    @ApiCreatedResponse({
        description: 'Get one category successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after get one category successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-02T11:42:19.469Z',
                            path: '/api/ecommerce/category/find/93f55388-cd92-4f76-8ece-60fcf16f6806',
                            message: null,
                            error: null,
                            data: {
                                id: '93f55388-cd92-4f76-8ece-60fcf16f6806',
                                name: 'Cosmestic',
                                description: 'Using for make beauty and hahahaahahaha haahaa',
                                createdAt: {
                                    low: 528503348,
                                    high: 399,
                                    unsigned: false,
                                },
                                domain: '30shine.com',
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Authorization failed',
        content: {
            'application/json': {
                examples: {
                    token_not_verified: {
                        summary: 'Token not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-27T17:42:40.039Z',
                            path: '/api/ecommerce/category/find/93f55388-cd92-4f76-8ece-60fcf16f6806',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                    category_not_found: {
                        summary: 'Category not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-02T11:43:05.882Z',
                            path: '/api/ecommerce/category/find/93f55388-cd92-4f76-8ece-60fcf16f680',
                            message: 'Category not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async findOneCategory(@Req() req: Request, @Param('id') id: string) {
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
            id,
        } as FindOneCategoryRequestDTO);
    }

    @Post('update')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Update one category',
        description: `
## Use access token
## Must be TENANT`,
    })
    @ApiCreatedResponse({
        description: 'Update one category successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after update category successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-05-02T17:39:47.880Z',
                            path: '/api/ecommerce/category/update',
                            message: null,
                            error: null,
                            data: {
                                id: '93f55388-cd92-4f76-8ece-60fcf16f6806',
                                name: 'SKinCare Khang oi',
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Authorization failed',
        content: {
            'application/json': {
                examples: {
                    token_not_verified: {
                        summary: 'Token not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-27T17:42:40.039Z',
                            path: '/api/ecommerce/category/update',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                    category_not_found: {
                        summary: 'Category not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-02T11:43:05.882Z',
                            path: '/api/ecommerce/category/update',
                            message: 'Category not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
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
    @ApiOperation({
        summary: 'Delete one category',
        description: `
## Use access token
## Must be TENANT`,
    })
    @ApiParam({
        name: 'id',
        description: 'ID of category in DB',
        example: '93f55388-cd92-4f76-8ece-60fcf16f6806',
        required: true,
    })
    @ApiCreatedResponse({
        description: 'Delete one category successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after delete category successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-02T17:44:14.267Z',
                            path: '/api/ecommerce/category/delete/93f55388-cd92-4f76-8ece-60fcf16f6806',
                            message: null,
                            error: null,
                            data: {
                                result: 'success',
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Authorization failed',
        content: {
            'application/json': {
                examples: {
                    token_not_verified: {
                        summary: 'Token not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-27T17:42:40.039Z',
                            path: '/api/ecommerce/category/update',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                    category_not_found: {
                        summary: 'Category not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-02T11:43:05.882Z',
                            path: '/api/ecommerce/category/update',
                            message: 'Category not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async deleteCategory(@Req() req: Request, @Param('id') id: string) {
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
            id,
        } as RemoveCategoryRequestDTO);
    }
}
