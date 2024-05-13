import { Body, Controller, Delete, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common';
import {
    ApiBadGatewayResponse,
    ApiBadRequestResponse,
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
    FindOneCategory,
    FindOneCategoryRequestDTO,
    RemoveCategory,
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
    @ApiBadRequestResponse({
        description: 'Validation failed',
        content: {
            'application/json': {
                examples: {
                    all_field_missing: {
                        summary: 'Response if all field missing and not valid with request',
                        value: {
                            statusCode: 400,
                            timestamp: '2024-05-13T08:26:02.300Z',
                            path: '/api/ecommerce/category/create',
                            message: 'name should not be empty, description should not be empty',
                            error: 'Bad Request',
                            data: null,
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
                            timestamp: '2024-05-13T15:23:40.909Z',
                            path: '/api/ecommerce/category/find/all',
                            message: null,
                            error: null,
                            data: {
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
        example: '58e6613d-41b0-4f31-93cf-91a211b12c9c',
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
                            timestamp: '2024-05-13T15:16:49.927Z',
                            path: '/api/ecommerce/category/find/58e6613d-41b0-4f31-93cf-91a211b12c9c',
                            message: null,
                            error: null,
                            data: {
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
                        },
                    },
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Validation failed',
        content: {
            'application/json': {
                examples: {
                    all_field_missing: {
                        summary: 'Response if all field missing and not valid with request',
                        value: {
                            statusCode: 400,
                            timestamp: '2024-05-13T08:45:19.575Z',
                            path: '/api/ecommerce/category/find/:id',
                            message: 'id must be a UUID',
                            error: 'Bad Request',
                            data: null,
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
    @ApiBadRequestResponse({
        description: 'Validation failed',
        content: {
            'application/json': {
                examples: {
                    all_field_missing: {
                        summary: 'Response if all field missing and not valid with request',
                        value: {
                            statusCode: 400,
                            timestamp: '2024-05-13T08:06:36.620Z',
                            path: '/api/ecommerce/category/update',
                            message:
                                'id should not be empty, id must be a UUID, name should not be empty, description should not be empty',
                            error: 'Bad Request',
                            data: null,
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
    @ApiBadRequestResponse({
        description: 'Validation failed',
        content: {
            'application/json': {
                examples: {
                    all_field_missing: {
                        summary: 'Response if all field missing and not valid with request',
                        value: {
                            statusCode: 400,
                            timestamp: '2024-05-13T08:48:59.955Z',
                            path: '/api/ecommerce/category/delete/:id',
                            message: 'id must be a UUID',
                            error: 'Bad Request',
                            data: null,
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
                            path: '/api/ecommerce/category/delete/93f55388-cd92-4f76-8ece-60fcf16f6806',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                    token_not_found: {
                        summary: 'Token not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-02T10:55:28.511Z',
                            path: '/api/ecommerce/category/delete/93f55388-cd92-4f76-8ece-60fcf16f6806',
                            message: 'Access Token not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                    unauthorized_role: {
                        summary: 'Role not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-27T12:31:30.700Z',
                            path: '/api/ecommerce/category/delete/93f55388-cd92-4f76-8ece-60fcf16f6806',
                            message: 'Unauthorized Role',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                    category_not_found: {
                        summary: 'Category not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-05-02T11:43:05.882Z',
                            path: '/api/ecommerce/category/delete/93f55388-cd92-4f76-8ece-60fcf16f6806',
                            message: 'Category not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
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
