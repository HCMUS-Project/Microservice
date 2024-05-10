import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Inject,
    UseGuards,
    Req,
    Query,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { RolesGuard } from 'src/common/guards/role/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/proto_build/auth/userToken/Role';

import { UserDto } from 'src/feature/commonDTO/user.dto';
import { BookingBookingsService } from './booking.service';
import {
    CreateBooking,
    CreateBookingRequestDTO,
    FindOne,
    FindOneRequestDTO,
    FindSlotBookings,
    FindSlotBookingsRequestDTO,
} from './booking.dto';

@Controller('/booking/bookings')
@ApiTags('booking/bookings')
export class BookingsController {
    constructor(
        @Inject('GRPC_ECOMMERCE_BOOKING_BOOKINGS')
        private readonly bookingBookingsService: BookingBookingsService,
    ) {}

    @Post('create')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.USER)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiOperation({
        summary: 'Create booking of user in domain',
        description: `
## Use access token
## Must use user account`,
    })
    @ApiBody({
        type: CreateBooking,
        examples: {
            category_1: {
                value: {
                    date: '2024-05-11T00:00:00.000Z',
                    employee: '626da565-3d8f-4019-8e13-07b43e06c1c5',
                    note: 'đặt chỗ',
                    service: 'dfb82e86-2ecc-4eb3-8123-174b2299ad68',
                    startTime: '2024-05-10T10:30:00.000Z',
                } as CreateBooking,
            },
        },
    })
    @ApiCreatedResponse({
        description: 'Create bookings successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after Create bookings successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-05-09T06:54:23.860Z',
                            path: '/api/booking/bookings/create',
                            message: null,
                            error: null,
                            data: {
                                id: 'a534f289-7276-4844-a4a2-7876bb325ad4',
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
                            path: '/api/booking/bookings/create',
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
                            path: '/api/booking/bookings/create',
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
                            path: '/api/booking/bookings/create',
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
                            path: '/api/booking/bookings/create',
                            message: 'Category already exists',
                            error: 'Forbidden',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async createBooking(@Req() req: Request, @Body() data: CreateBooking) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, data)
        return await this.bookingBookingsService.createBooking({
            user: userData,
            ...data,
        } as CreateBookingRequestDTO);
    }

    @Get('find/:id')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Find one bookings by ID',
        description: `
## Use access token
## Use id to path`,
    })
    @ApiParam({
        name: 'id',
        description: 'ID of the bookings',
        example: '',
        required: true,
        // type: FindOne
    })
    @ApiCreatedResponse({
        description: 'Get one booking successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after get one booking successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-09T07:02:38.308Z',
                            path: '/api/booking/bookings/find/a534f289-7276-4844-a4a2-7876bb325ad4',
                            message: null,
                            error: null,
                            data: {
                                id: 'a534f289-7276-4844-a4a2-7876bb325ad4',
                                startTime: '2024-05-10T10:30:00.000Z',
                                endTime: '2024-05-10T10:45:00.000Z',
                                note: 'đặt chỗ',
                                date: '2024-05-10T10:30:00.000Z',
                                status: 'padding',
                                isPaid: false,
                                user: 'volehoai070902@gmail.com',
                                employee: {
                                    id: '626da565-3d8f-4019-8e13-07b43e06c1c5',
                                    name: 'Ca 1',
                                },
                                service: {
                                    id: 'dfb82e86-2ecc-4eb3-8123-174b2299ad68',
                                    name: 'Cat toc',
                                },
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
                            path: '/api/booking/bookings/find/a534f289-7276-4844-a4a2-7876bb325ad4',
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
                            path: '/api/booking/bookings/find/a534f289-7276-4844-a4a2-7876bb325ad4',
                            message: 'Category not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async findOne(@Req() req: Request, @Param() params: FindOne) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.bookingBookingsService.findOne({
            user: userData,
            ...params,
        } as FindOneRequestDTO);
    }

    @Get('search')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Search one booking',
        description: `
## Use access token
## Use query
## Must have date and service
## employee, startTime and endTime is optional`,
    })
    @ApiQuery({
        name: 'date',
        description: 'Time of booking',
        required: true,
        example: '2024-05-11T00:00:00.000Z',
    })
    @ApiQuery({
        name: 'service',
        description: 'UUID of service',
        required: true,
        example: 'dfb82e86-2ecc-4eb3-8123-174b2299ad68',
    })
    @ApiQuery({
        name: 'employee',
        description: 'UUID of employee',
        required: false,
        example: '626da565-3d8f-4019-8e13-07b43e06c1c5',
    })
    @ApiQuery({
        name: 'startTime',
        description: 'Datetime',
        required: false,
        example: '2024-05-11T08:00:00.000Z',
    })
    @ApiQuery({
        name: 'endTime',
        description: 'Datetime',
        required: false,
        example: '2024-05-11T09:00:00.000Z',
    })
    @ApiCreatedResponse({
        description: 'Find one booking successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after find one booking successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-09T07:11:43.721Z',
                            path: '/api/booking/bookings/search?date=2024-05-11T00:00:00.000Z&service=dfb82e86-2ecc-4eb3-8123-174b2299ad68',
                            message: null,
                            error: null,
                            data: {
                                slotBookings: [
                                    {
                                        employees: [
                                            {
                                                id: '626da565-3d8f-4019-8e13-07b43e06c1c5',
                                                name: 'Ca 1',
                                            },
                                        ],
                                        date: '2024-05-11T00:00:00.000Z',
                                        service: 'dfb82e86-2ecc-4eb3-8123-174b2299ad68',
                                        startTime: '2024-05-11T06:00:00.000Z',
                                        endTime: '2024-05-11T06:15:00.000Z',
                                    },
                                    {
                                        employees: [
                                            {
                                                id: '626da565-3d8f-4019-8e13-07b43e06c1c5',
                                                name: 'Ca 1',
                                            },
                                        ],
                                        date: '2024-05-11T00:00:00.000Z',
                                        service: 'dfb82e86-2ecc-4eb3-8123-174b2299ad68',
                                        startTime: '2024-05-11T06:15:00.000Z',
                                        endTime: '2024-05-11T06:30:00.000Z',
                                    },
                                    {
                                        employees: [
                                            {
                                                id: '626da565-3d8f-4019-8e13-07b43e06c1c5',
                                                name: 'Ca 1',
                                            },
                                        ],
                                        date: '2024-05-11T00:00:00.000Z',
                                        service: 'dfb82e86-2ecc-4eb3-8123-174b2299ad68',
                                        startTime: '2024-05-11T06:30:00.000Z',
                                        endTime: '2024-05-11T06:45:00.000Z',
                                    },
                                    {
                                        employees: [
                                            {
                                                id: '626da565-3d8f-4019-8e13-07b43e06c1c5',
                                                name: 'Ca 1',
                                            },
                                        ],
                                        date: '2024-05-11T00:00:00.000Z',
                                        service: 'dfb82e86-2ecc-4eb3-8123-174b2299ad68',
                                        startTime: '2024-05-11T06:45:00.000Z',
                                        endTime: '2024-05-11T07:00:00.000Z',
                                    },
                                    {
                                        employees: [
                                            {
                                                id: '626da565-3d8f-4019-8e13-07b43e06c1c5',
                                                name: 'Ca 1',
                                            },
                                        ],
                                        date: '2024-05-11T00:00:00.000Z',
                                        service: 'dfb82e86-2ecc-4eb3-8123-174b2299ad68',
                                        startTime: '2024-05-11T07:00:00.000Z',
                                        endTime: '2024-05-11T07:15:00.000Z',
                                    },
                                    {
                                        employees: [
                                            {
                                                id: '626da565-3d8f-4019-8e13-07b43e06c1c5',
                                                name: 'Ca 1',
                                            },
                                        ],
                                        date: '2024-05-11T00:00:00.000Z',
                                        service: 'dfb82e86-2ecc-4eb3-8123-174b2299ad68',
                                        startTime: '2024-05-11T07:15:00.000Z',
                                        endTime: '2024-05-11T07:30:00.000Z',
                                    },
                                    {
                                        employees: [
                                            {
                                                id: '626da565-3d8f-4019-8e13-07b43e06c1c5',
                                                name: 'Ca 1',
                                            },
                                        ],
                                        date: '2024-05-11T00:00:00.000Z',
                                        service: 'dfb82e86-2ecc-4eb3-8123-174b2299ad68',
                                        startTime: '2024-05-11T07:30:00.000Z',
                                        endTime: '2024-05-11T07:45:00.000Z',
                                    },
                                    {
                                        employees: [
                                            {
                                                id: '626da565-3d8f-4019-8e13-07b43e06c1c5',
                                                name: 'Ca 1',
                                            },
                                        ],
                                        date: '2024-05-11T00:00:00.000Z',
                                        service: 'dfb82e86-2ecc-4eb3-8123-174b2299ad68',
                                        startTime: '2024-05-11T07:45:00.000Z',
                                        endTime: '2024-05-11T08:00:00.000Z',
                                    },
                                    {
                                        employees: [
                                            {
                                                id: '626da565-3d8f-4019-8e13-07b43e06c1c5',
                                                name: 'Ca 1',
                                            },
                                        ],
                                        date: '2024-05-11T00:00:00.000Z',
                                        service: 'dfb82e86-2ecc-4eb3-8123-174b2299ad68',
                                        startTime: '2024-05-11T08:15:00.000Z',
                                        endTime: '2024-05-11T08:30:00.000Z',
                                    },
                                    {
                                        employees: [
                                            {
                                                id: '626da565-3d8f-4019-8e13-07b43e06c1c5',
                                                name: 'Ca 1',
                                            },
                                        ],
                                        date: '2024-05-11T00:00:00.000Z',
                                        service: 'dfb82e86-2ecc-4eb3-8123-174b2299ad68',
                                        startTime: '2024-05-11T08:30:00.000Z',
                                        endTime: '2024-05-11T08:45:00.000Z',
                                    },
                                    {
                                        employees: [
                                            {
                                                id: '626da565-3d8f-4019-8e13-07b43e06c1c5',
                                                name: 'Ca 1',
                                            },
                                        ],
                                        date: '2024-05-11T00:00:00.000Z',
                                        service: 'dfb82e86-2ecc-4eb3-8123-174b2299ad68',
                                        startTime: '2024-05-11T08:45:00.000Z',
                                        endTime: '2024-05-11T09:00:00.000Z',
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
                            path: '/api/booking/bookings/search?date=2024-05-11T00:00:00.000Z&service=dfb82e86-2ecc-4eb3-8123-174b2299ad68&employee=626da565-3d8f-4019-8e13-07b43e06c1c5&startTime=2024-05-11T08:00:00.000Z&endTime=2024-05-11T09:00:00.000Z',
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
                            path: '/api/booking/bookings/search?date=2024-05-11T00:00:00.000Z&service=dfb82e86-2ecc-4eb3-8123-174b2299ad68&employee=626da565-3d8f-4019-8e13-07b43e06c1c5&startTime=2024-05-11T08:00:00.000Z&endTime=2024-05-11T09:00:00.000Z',
                            message: 'Category not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async findSlotBookings(@Req() req: Request, @Query() query: FindSlotBookings) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.bookingBookingsService.findSlotBookings({
            user: userData,
            ...query,
        } as FindSlotBookingsRequestDTO);
    }

    //     @Delete('delete/:id')
    //     @UseGuards(AccessTokenGuard, RolesGuard)
    //     @Roles(Role.TENANT)
    //     @ApiBearerAuth('JWT-access-token-tenant')
    //     @ApiOperation({
    //         summary: 'Delete one service',
    //         description: `
    // ## Use access token
    // ## Must be TENANT`,
    //     })
    //     @ApiParam({
    //         name: 'id',
    //         description: 'ID of the service',
    //         example: 'cebe7542-5749-4a4c-99bb-ad1ec53953af',
    //         required: true,
    //     })
    //     @ApiCreatedResponse({
    //         description: 'Delete one service successfully!!',
    //         content: {
    //             'application/json': {
    //                 examples: {
    //                     signin: {
    //                         summary: 'Response after delete service successfully',
    //                         value: {
    //                             statusCode: 200,
    //                             timestamp: '2024-05-08T06:30:26.410Z',
    //                             path: '/api/booking/services/delete/cebe7542-5749-4a4c-99bb-ad1ec53953af',
    //                             message: null,
    //                             error: null,
    //                             data: {
    //                                 result: 'success',
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     })
    //     @ApiUnauthorizedResponse({
    //         description: 'Authorization failed',
    //         content: {
    //             'application/json': {
    //                 examples: {
    //                     token_not_verified: {
    //                         summary: 'Token not verified',
    //                         value: {
    //                             statusCode: 401,
    //                             timestamp: '2024-04-27T17:42:40.039Z',
    //                             path: '/api/booking/services/delete/cebe7542-5749-4a4c-99bb-ad1ec53953af',
    //                             message: 'Unauthorized',
    //                             error: null,
    //                             data: null,
    //                         },
    //                     },
    //                     category_not_found: {
    //                         summary: 'Category not found',
    //                         value: {
    //                             statusCode: 401,
    //                             timestamp: '2024-05-02T11:43:05.882Z',
    //                             path: '/api/booking/services/delete/cebe7542-5749-4a4c-99bb-ad1ec53953af',
    //                             message: 'Category not found',
    //                             error: 'Unauthorized',
    //                             data: null,
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     })
    //     async deleteService(@Req() req: Request, @Param() param: DeleteService) {
    //         const payloadToken = req['user'];
    //         // const header = req.headers;
    //         const userData = {
    //             email: payloadToken.email,
    //             domain: payloadToken.domain,
    //             role: payloadToken.role,
    //             accessToken: payloadToken.accessToken,
    //         } as UserDto;
    //         // console.log(userData, dataCategory)
    //         return await this.bookingServicesService.deleteService({
    //             user: userData,
    //             ...param,
    //         } as DeleteServiceRequestDTO);
    //     }

    //     @Post('update')
    //     @UseGuards(AccessTokenGuard, RolesGuard)
    //     @Roles(Role.TENANT)
    //     @ApiBearerAuth('JWT-access-token-tenant')
    //     @ApiOperation({
    //         summary: 'Update services of domain',
    //         description: `
    // ## Use access token
    // ## Must use tenant account`,
    //     })
    //     @ApiBody({
    //         type: UpdateService,
    //         examples: {
    //             category_1: {
    //                 value: {
    //                     id: 'dfb82e86-2ecc-4eb3-8123-174b2299ad68',
    //                     name: 'Cat toc',
    //                     description: 'cat toc di ma pls',
    //                     price: 50000,
    //                     timeService: {
    //                         startTime: '13:00',
    //                         endTime: '16:00',
    //                         duration: 15,
    //                         breakStart: '15:00',
    //                         breakEnd: '15:15',
    //                     },
    //                     images: [
    //                         'data:image/jpeg;base64,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',
    //                         'data:image/jpeg;base64,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',
    //                     ],
    //                 } as UpdateService,
    //             },
    //         },
    //     })
    //     @ApiCreatedResponse({
    //         description: 'Update services successfully!!',
    //         content: {
    //             'application/json': {
    //                 examples: {
    //                     signin: {
    //                         summary: 'Response after update services successfully',
    //                         value: {
    //                             statusCode: 201,
    //                             timestamp: '2024-05-09T05:51:38.808Z',
    //                             path: '/api/booking/services/update',
    //                             message: null,
    //                             error: null,
    //                             data: {
    //                                 images: [
    //                                     'https://dpbostudfzvnyulolxqg.supabase.co/storage/v1/object/public/datn.serviceBooking/service/7f1196ec-911b-437b-87a0-f9f6670c6a50',
    //                                     'https://dpbostudfzvnyulolxqg.supabase.co/storage/v1/object/public/datn.serviceBooking/service/77ffc548-559c-45c2-8da5-1b3b55043810',
    //                                 ],
    //                                 id: 'dfb82e86-2ecc-4eb3-8123-174b2299ad68',
    //                                 name: 'Cat toc',
    //                                 description: 'cat toc di ma pls',
    //                                 price: 50000,
    //                                 rating: 0,
    //                                 views: 0,
    //                                 domain: '30shine.com',
    //                                 timeService: {
    //                                     startTime: '13:00',
    //                                     endTime: '16:00',
    //                                     duration: 15,
    //                                     breakStart: '15:00',
    //                                     breakEnd: '15:15',
    //                                 },
    //                                 createdAt: {
    //                                     low: 1541889011,
    //                                     high: 399,
    //                                     unsigned: false,
    //                                 },
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     })
    //     @ApiUnauthorizedResponse({
    //         description: 'Authorization failed',
    //         content: {
    //             'application/json': {
    //                 examples: {
    //                     token_not_verified: {
    //                         summary: 'Token not verified',
    //                         value: {
    //                             statusCode: 401,
    //                             timestamp: '2024-04-27T12:31:30.700Z',
    //                             path: '/api/booking/services/update',
    //                             message: 'Unauthorized',
    //                             error: null,
    //                             data: null,
    //                         },
    //                     },
    //                     unauthorized_role: {
    //                         summary: 'Role not verified',
    //                         value: {
    //                             statusCode: 401,
    //                             timestamp: '2024-04-27T12:31:30.700Z',
    //                             path: '/api/booking/services/update',
    //                             message: 'Unauthorized Role',
    //                             error: 'Unauthorized',
    //                             data: null,
    //                         },
    //                     },
    //                     token_not_found: {
    //                         summary: 'Token not found',
    //                         value: {
    //                             statusCode: 401,
    //                             timestamp: '2024-05-02T10:55:28.511Z',
    //                             path: '/api/booking/services/update',
    //                             message: 'Access Token not found',
    //                             error: 'Unauthorized',
    //                             data: null,
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     })
    //     @ApiForbiddenResponse({
    //         description: 'Forbidden',
    //         content: {
    //             'application/json': {
    //                 examples: {
    //                     user_not_verified: {
    //                         summary: 'Category already exists',
    //                         value: {
    //                             statusCode: 403,
    //                             timestamp: '2024-05-02T11:24:03.152Z',
    //                             path: '/api/booking/services/update',
    //                             message: 'Category already exists',
    //                             error: 'Forbidden',
    //                             data: null,
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     })
    //     async updateService(@Req() req: Request, @Body() data: UpdateService) {
    //         const payloadToken = req['user'];
    //         // const header = req.headers;
    //         const userData = {
    //             email: payloadToken.email,
    //             domain: payloadToken.domain,
    //             role: payloadToken.role,
    //             accessToken: payloadToken.accessToken,
    //         } as UserDto;
    //         // console.log(userData, data)
    //         return await this.bookingServicesService.updateService({
    //             user: userData,
    //             ...data,
    //         } as UpdateServiceRequestDTO);
    //     }
}
