import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiHeader,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthServiceProfile } from './profile.service';
import { GetProfileRequestDTO, UpdateProfileDto, UpdateProfileRequestDTO } from './profile.dto';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { RolesGuard } from 'src/common/guards/role/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { UserDto } from 'src/feature/commonDTO/user.dto';

@Controller('auth')
@ApiTags('auth')
export class ProfileController {
    constructor(
        @Inject('GRPC_AUTH_SERVICE_PROFILE')
        private readonly authServiceProfile: AuthServiceProfile,
    ) {}

    @Get('get-profile')
    // @UseGuards(AccessTokenGuard, RolesGuard)
    // @Roles(Role.USER)
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Get profile of user',
        description: `
## Use access token`,
    })
    @ApiBearerAuth('JWT-access-token-user')
    @ApiCreatedResponse({
        description: 'Get profile successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after get profile successfully',
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
    @ApiUnauthorizedResponse({
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
                            message: 'User not verified',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                    user_not_found: {
                        summary: 'User not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-24T07:23:58.916Z',
                            path: '/api/auth/get-profile',
                            message: 'User not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                    user_invalid_password: {
                        summary: 'Unauthorized Token',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-26T19:40:57.817Z',
                            path: '/api/auth/get-profile',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async getProfile(@Req() req: Request) {
        const payloadToken = req['user'];
        const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(payloadToken, header);
        return await this.authServiceProfile.getProfile({
            user: userData,
        });
    }

    @Post('update-profile')
    // @UseGuards(AccessTokenGuard, RolesGuard)
    // @Roles(Role.USER)
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Update profile of user',
        description: `
## Must use access token
## Must have body to update`,
    })
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBody({
        type: UpdateProfileRequestDTO,
        examples: {
            user_1: {
                value: {
                    username: 'something',
                    phone: '',
                    address: 'something',
                    name: 'something',
                    gender: 'sometihng',
                    age: 1,
                } as UpdateProfileRequestDTO,
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
        description: 'User update profile successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after update profile successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-04-26T20:06:24.815Z',
                            path: '/api/auth/update-profile',
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
                    fields_missing: {
                        value: {
                            statusCode: 400,
                            timestamp: '2024-04-26T20:11:28.852Z',
                            path: '/api/auth/update-profile',
                            message:
                                'username should not be empty, phone should not be empty, Must be VietNam Phone Number (84..), address should not be empty, name should not be empty, gender should not be empty, Must be a valid gender: male, female, other, age should not be empty, age must not be less than 0, age must be an integer number',
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
                        summary: 'Unauthorized token',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-26T20:00:13.766Z',
                            path: '/api/auth/update-profile',
                            message: 'Unauthorized',
                            error: null,
                            data: null,
                        },
                    },
                    user_not_found: {
                        summary: 'User not found',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-24T07:23:58.916Z',
                            path: '/api/auth/update-profile',
                            message: 'User not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                    user_not_verified: {
                        summary: 'User not verified',
                        value: {
                            statusCode: 401,
                            timestamp: '2024-04-24T07:26:57.326Z',
                            path: '/api/auth/update-profile',
                            message: 'User not verified',
                            error: 'Forbidden',
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
                    update_profile_failed: {
                        summary: 'Update profile failed',
                        value: {
                            statusCode: 403,
                            timestamp: '2024-04-26T20:00:13.766Z',
                            path: '/api/auth/update-profile',
                            message: 'Update profile failed',
                            error: 'Forbidden',
                            data: null,
                        },
                    },
                    user_not_found: {
                        summary: 'Update username of User table failed',
                        value: {
                            statusCode: 403,
                            timestamp: '2024-04-24T07:23:58.916Z',
                            path: '/api/auth/update-profile',
                            message: 'Update username of User table failed',
                            error: 'Forbidden',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async updateProfile(@Req() req: Request, @Body() updateData: UpdateProfileDto) {
        // console.log(req['user'], req.headers, req.body)
        // return 'success'
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;

        return await this.authServiceProfile.updateProfile({
            ...updateData,
            user: userData,
        } as UpdateProfileRequestDTO);
    }
}
