import { Body, Controller, Delete, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOperation,
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

@Controller('/ecommerce')
@ApiTags('ecommerce')
export class CategoryController {
    constructor(
        @Inject('GRPC_ECOMMERCE_SERVICE_CATEGORY')
        private readonly ecommerceCategoryService: EcommerceCategoryService,
    ) {}

    @Post('create-category')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiOperation({
        summary: 'Create category of domain',
        description: `
## Use access token
## Must have name and decription of category`,
    })
    @ApiBearerAuth('JWT-access-token')
    @ApiBody({
        type: CreateCategory,
        examples: {
            category_1: {
                value: {
                    name: 'Cosmestic',
                    description: 'Using for make beauty and hahahaahahaha haahaa',
                } as CreateCategory,
            },
            // user_2: {
            //     value: {
            //         domain: '24shine.com',
            //         email: 'nguyenvukhoi150402@gmail.com',
            //         password: '1232@asdS',
            //     } as SignInRequestDTO,
            // },
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
                            timestamp: '2024-04-27T12:20:54.477Z',
                            path: '/api/ecommerce/create-category',
                            message: null,
                            error: null,
                            data: {
                                id: '93f55388-cd92-4f76-8ece-60fcf16f6806',
                                name: 'Cosmestic',
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
                            path: '/api/ecommerce/create-category',
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
                            path: '/api/ecommerce/create-category',
                            message: 'Unauthorized Role',
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
                            statusCode: 401,
                            timestamp: '2024-04-24T07:21:33.501Z',
                            path: '/api/auth/get-profile',
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

    @Get('find-all-categories')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({
        summary: 'Find all categories',
        description: `
## Use access token`,
    })
    @ApiBearerAuth('JWT-access-token')
    @ApiCreatedResponse({
        description: 'Get all categories successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after get all categories successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-04-27T17:39:25.039Z',
                            path: '/api/ecommerce/find-all-categories',
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
                                        id: 'f3072e87-2954-4435-82ec-a40afda8f57d',
                                        name: 'Skincare',
                                        description: 'Skin care will fun',
                                        createdAt: {
                                            low: 532444540,
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
                            timestamp: '2024-04-27T17:42:40.039Z',
                            path: '/api/ecommerce/find-all-categories',
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

    @Get('find-one-category/:id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({
        summary: 'Find one category',
        description: `
## Use access token
## Use id to path`,
    })
    @ApiBearerAuth('JWT-access-token')
    @ApiCreatedResponse({
        description: 'Get one category successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after get one category successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-04-27T18:22:07.925Z',
                            path: '/api/ecommerce/find-one-category/f3072e87-2954-4435-82ec-a40afda8f57d',
                            message: null,
                            error: null,
                            data: {
                                id: 'f3072e87-2954-4435-82ec-a40afda8f57d',
                                name: 'Skincare',
                                description: 'Skin care will fun',
                                createdAt: {
                                    low: 532444540,
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
                            path: '/api/ecommerce/find-one-category/f3072e87-2954-4435-82ec-a40afda8f57d',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                    category_not_found: {
                        summary: 'Category not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-27T17:42:40.039Z',
                            path: '/api/ecommerce/find-one-category/f3072e87-2954-4435-82ec-a40afda8f57d',
                            message: 'Unauthorized',
                            error: null,
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

    @Post('update-category')
    @UseGuards(AccessTokenGuard)
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
            ...updateCategory
        } as UpdateCategoryRequestDTO);
    }

    @Delete('delete-category/:id')
    @UseGuards(AccessTokenGuard)
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
            id
        } as RemoveCategoryRequestDTO);
    }
}
