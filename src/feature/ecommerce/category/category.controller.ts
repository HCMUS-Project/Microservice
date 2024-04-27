import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { EcommerceCategoryService } from './category.service';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { RolesGuard } from 'src/common/guards/role/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CreateCategoryRequestDTO } from './category.dto';
import { UserDto } from 'src/feature/commonDTO/user.dto';

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
    @ApiCreatedResponse({
        description: 'Create category successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after Create category successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-04-26T07:31:57.304Z',
                            path: '/api/auth/get-profile',
                            message: null,
                            error: null,
                            data: {
                                email: 'nguyenvukhoi150402@gmail.com',
                                role: 0,
                                username: 'vukhoi5a',
                                domain: '30shine.com',
                                phone: '84931056895',
                                address: '',
                                name: '',
                                gender: '',
                                age: -1,
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiForbiddenResponse({
        description: 'Authorization failed',
        content: {
            'application/json': {
                examples: {
                    user_not_verified: {
                        summary: 'User not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-24T07:21:33.501Z',
                            path: '/api/auth/get-profile',
                            message: 'Category already exists',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async createCategory(@Req() req: Request, @Body() dataCategory: CreateCategoryRequestDTO) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        console.log(userData, dataCategory)
        return await this.ecommerceCategoryService.create({
            user: userData,
            ...dataCategory,
        } as CreateCategoryRequestDTO);
    }
}
