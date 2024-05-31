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
    DeleteBooking,
    DeleteBookingRequestDTO,
    FindOne,
    FindOneRequestDTO,
    FindSlotBookings,
    FindSlotBookingsRequestDTO,
    UpdateStatusBooking,
    UpdateStatusBookingRequestDTO,
} from './booking.dto';
import {
    ApiBodyExample,
    ApiEndpoint,
    ApiErrorResponses,
    ApiParamExamples,
    ApiQueryExamples,
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';

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
    @ApiEndpoint({
        summary: `Create a Booking`,
        details: `
## Description
Create a Booking within a domain using an access token. This operation is restricted to user accounts only.
        
## Requirements
- **Access Token**: Must provide a valid user access token.
- **Permissions**: Requires user-level permissions.
`,
    })
    @ApiBodyExample(CreateBooking, {
        date: '2024-05-26',
        note: 'đặt chỗ lam cho anh vip vip nha',
        service: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
        startTime: '2024-05-26T11:30:00.000Z',
        employee: 'acfcd78d-54a8-408c-b720-a0f63941f64b',
    })
    @ApiResponseExample(
        'create',
        'create Booking',
        { id: 'ff9c6aa3-6417-492c-9539-279081b57803' },
        '/api/booking/bookings/create',
    )
    @ApiErrorResponses('/api/booking/bookings/create', '/api/api/booking/bookings/create', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'date should not be empty, date must be a valid ISO 8601 date string, service should not be empty, service must be a UUID, startTime should not be empty, startTime must be a valid ISO 8601 date string',
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
                summary: 'Services not found',
                detail: 'Services not found',
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
                key: 'no_employee',
                summary: 'None of employee available for booking',
                detail: 'None of employee available for booking',
            },
        ],
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
    @ApiEndpoint({
        summary: `Find one Booking by Id`,
        details: `
## Description
Find a Booking within a domain using an access token.
## Requirements
- **Access Token**: Must provide a valid access token.
`,
    })
    @ApiParamExamples([
        {
            name: 'id',
            description: 'ID of an employee',
            example: 'a1282f4f-5990-4fbd-915e-db951a1f6430',
            required: true,
        },
    ])
    @ApiResponseExample(
        'read',
        'find a Booking by Id',
        {
            id: 'a1282f4f-5990-4fbd-915e-db951a1f6430',
            startTime: '2024-05-26T11:30:00.000Z',
            endTime: '2024-05-26T12:00:00.000Z',
            note: 'đặt chỗ lam cho anh vip vip nha',
            date: '2024-05-26T11:30:00.000Z',
            status: 'padding',
            isPaid: false,
            user: 'volehoai070902@gmail.com',
            employee: {
                id: 'fc4adb94-daaa-4b16-927f-84a61ec28221',
                firstName: 'Nguyen Vu',
                lastName: 'Khoi',
                email: 'nguyenvukhoi150402@gmail.com',
            },
            service: {
                id: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
                name: 'Cat toc 123',
            },
        },
        '/api/booking/bookings/find/a534f289-7276-4844-a4a2-7876bb325ad4',
    )
    @ApiErrorResponses(
        '/api/booking/employee/find/:id',
        '/api/booking/bookings/find/a534f289-7276-4844-a4a2-7876bb325ad4',
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
                    summary: 'Booking not found',
                    detail: 'Booking not found',
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
    @ApiEndpoint({
        summary: `Find available Slots Booking by condition`,
        details: `
## Description
Find available Slots Booking within a domain using an access token.
## Requirements
- **Access Token**: Must provide a valid access token.
- Must has **services** and **date** in query to find all **slots** with **employee** available can do service.
`,
    })
    @ApiQueryExamples([
        {
            name: 'date',
            description: 'Time of booking',
            required: true,
            example: '2024-05-26',
        },
        {
            name: 'service',
            description: 'UUID of service',
            required: true,
            example: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
        },
        // {
        //     name: 'employee',
        //     description: 'UUID of employee',
        //     required: false,
        //     example: '626da565-3d8f-4019-8e13-07b43e06c1c5',
        // },
        // {
        //     name: 'startTime',
        //     description: 'Datetime',
        //     required: false,
        //     example: '2024-05-11T08:00:00.000Z',
        // },
        // {
        //     name: 'endTime',
        //     description: 'Datetime',
        //     required: false,
        //     example: '2024-05-11T09:00:00.000Z',
        // },
    ])
    @ApiResponseExample(
        'read',
        'find available Slots Booking by condition',
        {
            slotBookings: [
                {
                    employees: [
                        {
                            id: 'fc4adb94-daaa-4b16-927f-84a61ec28221',
                            firstName: 'Nguyen Vu',
                            lastName: 'Khoi',
                            email: 'nguyenvukhoi150402@gmail.com',
                        },
                        {
                            id: 'acfcd78d-54a8-408c-b720-a0f63941f64b',
                            firstName: 'Nguyen',
                            lastName: 'Quan',
                            email: 'nguyenquan123@gmail.com',
                        },
                    ],
                    date: '2024-05-26',
                    service: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
                    startTime: '2024-05-26T10:00:00.000Z',
                    endTime: '2024-05-26T10:30:00.000Z',
                },
                {
                    employees: [
                        {
                            id: 'fc4adb94-daaa-4b16-927f-84a61ec28221',
                            firstName: 'Nguyen Vu',
                            lastName: 'Khoi',
                            email: 'nguyenvukhoi150402@gmail.com',
                        },
                        {
                            id: 'acfcd78d-54a8-408c-b720-a0f63941f64b',
                            firstName: 'Nguyen',
                            lastName: 'Quan',
                            email: 'nguyenquan123@gmail.com',
                        },
                    ],
                    date: '2024-05-26',
                    service: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
                    startTime: '2024-05-26T10:30:00.000Z',
                    endTime: '2024-05-26T11:00:00.000Z',
                },
                {
                    employees: [
                        {
                            id: 'fc4adb94-daaa-4b16-927f-84a61ec28221',
                            firstName: 'Nguyen Vu',
                            lastName: 'Khoi',
                            email: 'nguyenvukhoi150402@gmail.com',
                        },
                        {
                            id: 'acfcd78d-54a8-408c-b720-a0f63941f64b',
                            firstName: 'Nguyen',
                            lastName: 'Quan',
                            email: 'nguyenquan123@gmail.com',
                        },
                    ],
                    date: '2024-05-26',
                    service: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
                    startTime: '2024-05-26T11:00:00.000Z',
                    endTime: '2024-05-26T11:30:00.000Z',
                },
                {
                    employees: [
                        {
                            id: 'fc4adb94-daaa-4b16-927f-84a61ec28221',
                            firstName: 'Nguyen Vu',
                            lastName: 'Khoi',
                            email: 'nguyenvukhoi150402@gmail.com',
                        },
                        {
                            id: 'acfcd78d-54a8-408c-b720-a0f63941f64b',
                            firstName: 'Nguyen',
                            lastName: 'Quan',
                            email: 'nguyenquan123@gmail.com',
                        },
                    ],
                    date: '2024-05-26',
                    service: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
                    startTime: '2024-05-26T11:30:00.000Z',
                    endTime: '2024-05-26T12:00:00.000Z',
                },
                {
                    employees: [],
                    date: '2024-05-26',
                    service: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
                    startTime: '2024-05-26T12:00:00.000Z',
                    endTime: '2024-05-26T12:30:00.000Z',
                },
                {
                    employees: [],
                    date: '2024-05-26',
                    service: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
                    startTime: '2024-05-26T12:30:00.000Z',
                    endTime: '2024-05-26T13:00:00.000Z',
                },
                {
                    employees: [],
                    date: '2024-05-26',
                    service: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
                    startTime: '2024-05-26T14:00:00.000Z',
                    endTime: '2024-05-26T14:30:00.000Z',
                },
                {
                    employees: [],
                    date: '2024-05-26',
                    service: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
                    startTime: '2024-05-26T14:30:00.000Z',
                    endTime: '2024-05-26T15:00:00.000Z',
                },
                {
                    employees: [],
                    date: '2024-05-26',
                    service: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
                    startTime: '2024-05-26T15:00:00.000Z',
                    endTime: '2024-05-26T15:30:00.000Z',
                },
                {
                    employees: [],
                    date: '2024-05-26',
                    service: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
                    startTime: '2024-05-26T15:30:00.000Z',
                    endTime: '2024-05-26T16:00:00.000Z',
                },
                {
                    employees: [],
                    date: '2024-05-26',
                    service: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
                    startTime: '2024-05-26T16:00:00.000Z',
                    endTime: '2024-05-26T16:30:00.000Z',
                },
                {
                    employees: [],
                    date: '2024-05-26',
                    service: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
                    startTime: '2024-05-26T16:30:00.000Z',
                    endTime: '2024-05-26T17:00:00.000Z',
                },
                {
                    employees: [],
                    date: '2024-05-26',
                    service: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
                    startTime: '2024-05-26T17:00:00.000Z',
                    endTime: '2024-05-26T17:30:00.000Z',
                },
                {
                    employees: [],
                    date: '2024-05-26',
                    service: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
                    startTime: '2024-05-26T17:30:00.000Z',
                    endTime: '2024-05-26T18:00:00.000Z',
                },
            ],
        },
        '/api/booking/bookings/search?date=2024-05-26&service=c2a4917c-b3ab-4ebf-aac3-563ab102e671',
    )
    @ApiErrorResponses(
        '/api/booking/bookings/search?date=&service=',
        '/api/booking/bookings/search?date=2024-05-26&service=c2a4917c-b3ab-4ebf-aac3-563ab102e671',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'date should not be empty, date must be a valid ISO 8601 date string, service should not be empty, service must be a UUID',
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
                    summary: 'Service not found',
                    detail: 'Service not found',
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

    @Post('update')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Update Status Booking`,
        details: `
## Description
Update Status Booking within a domain using an access token. This operation is restricted to user and tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid user and tenant access token.
- **Permissions**: Requires user-level and tenant-level permissions.
`,
    })
    @ApiBodyExample(UpdateStatusBooking, {
        id: '343505f9-6783-422f-ac47-7854e2e79603',
        status: 'SUCCESS',
    })
    @ApiResponseExample(
        'update',
        'update Status Booking',
        {
            id: '343505f9-6783-422f-ac47-7854e2e79603',
            startTime: '2024-05-31T11:30:00.000Z',
            endTime: '2024-05-31T12:00:00.000Z',
            note: 'đặt chỗ lam cho anh vip vip nha',
            date: '2024-05-31T11:30:00.000Z',
            status: 'SUCCESS',
            user: 'volehoai070902@gmail.com',
            employee: {
                id: 'acfcd78d-54a8-408c-b720-a0f63941f64b',
                firstName: 'Nguyen',
                lastName: 'Quan',
                email: 'nguyenquan123@gmail.com',
            },
            service: {
                id: 'c2a4917c-b3ab-4ebf-aac3-563ab102e671',
                name: 'Cat toc 123',
            },
        },
        '/api/booking/bookings/update',
    )
    @ApiErrorResponses('/api/booking/bookings/update', '/api/booking/bookings/update', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'id should not be empty, id must be a UUID, status should not be empty, Must be a valid status: PENDING, SUCCESSS, CANCEL',
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
                key: 'not_found',
                summary: 'Booking not found',
                detail: 'Booking not found',
            },
            {
                key: 'cant_update',
                summary: 'Booking cant update status',
                detail: 'Booking cant update status',
            },
        ],
    })
    async updateStatusBooking(@Req() req: Request, @Body() data: UpdateStatusBooking) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, data)
        return await this.bookingBookingsService.updateStatusBooking({
            user: userData,
            ...data,
        } as UpdateStatusBookingRequestDTO);
    }

    @Delete('delete')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Delete Booking`,
        details: `
## Description
Delete Booking within a domain using an access token. This operation is restricted to user and tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid user and tenant access token.
- **Permissions**: Requires user-level and tenant-level permissions.
`,
    })
    @ApiBodyExample(DeleteBooking, {
        id: '343505f9-6783-422f-ac47-7854e2e79603',
        note: 'xoá đi vì lười',
    })
    @ApiResponseExample(
        'delete',
        'delete Booking',
        { result: 'success' },
        '/api/booking/bookings/delete',
    )
    @ApiErrorResponses('/api/booking/bookings/delete', '/api/booking/bookings/delete', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'id should not be empty, id must be a UUID, note should not be empty',
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
                key: 'not_found',
                summary: 'Booking not found',
                detail: 'Booking not found',
            },
            {
                key: 'cant_delete',
                summary: 'Booking cant delete becasue not PENDING',
                detail: 'Booking cant delete becasue not PENDING',
            },
        ],
    })
    async deleteBooking(@Req() req: Request, @Body() data: DeleteBooking) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, data)
        return await this.bookingBookingsService.deleteBooking({
            user: userData,
            ...data,
        } as DeleteBookingRequestDTO);
    }
}
