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
import { BookingEmployeeService } from './employee.service';
import {
    CreateEmployee,
    CreateEmployeeRequestDTO,
    DeleteEmployee,
    DeleteEmployeeRequestDTO,
    FindEmployee,
    FindEmployeeRequestDTO,
    FindOneEmployeeRequestDTO,
    UpdateEmployee,
    UpdateEmployeeRequestDTO,
} from './employee.dto';
import { FindOneEmployeeRequest } from 'src/proto_build/booking/employee/FindOneEmployeeRequest';
import { FindOneEmployeeResponse } from 'src/proto_build/booking/employee/FindOneEmployeeResponse';
import { WorkDays } from 'src/common/enums/workDays.enum';
import { FindOne } from '../services/services.dto';
import { WorkShift } from 'src/common/enums/workShift.enum';

@Controller('/booking/employee')
@ApiTags('booking/employee')
export class EmployeeController {
    constructor(
        @Inject('GRPC_ECOMMERCE_BOOKING_EMPLOYEE')
        private readonly bookingEmployeeService: BookingEmployeeService,
    ) {}

    @Post('create')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Create employee of domain',
        description: `
## Use access token
## Must use tenant account`,
    })
    @ApiBody({
        type: CreateEmployee,
        examples: {
            category_1: {
                value: {} as CreateEmployee,
            },
        },
    })
    @ApiCreatedResponse({
        description: 'Create services successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after Create services successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-05-08T10:01:30.061Z',
                            path: '/api/booking/employee/create',
                            message: null,
                            error: null,
                            data: {
                                id: 'd4112320-a998-4ff5-ba84-b31514f43bc6',
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
                            path: '/api/booking/employee/create',
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
                            path: '/api/booking/employee/create',
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
                            path: '/api/booking/employee/create',
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
                            path: '/api/booking/employee/create',
                            message: 'Category already exists',
                            error: 'Forbidden',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async createEmployee(@Req() req: Request, @Body() data: CreateEmployee) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, data)
        return await this.bookingEmployeeService.createEmployee({
            user: userData,
            ...data,
        } as CreateEmployeeRequestDTO);
    }

    @Get('find/:id')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Find one employee by ID',
        description: `
## Use access token
## Use id to path`,
    })
    @ApiParam({
        name: 'id',
        description: 'ID of the employee',
        example: 'd4112320-a998-4ff5-ba84-b31514f43bc6',
        required: true,
        // type: FindOne
    })
    @ApiCreatedResponse({
        description: 'Get one employee successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after get one employee successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-10T09:03:47.836Z',
                            path: '/api/booking/employee/find/9705690b-45d9-4d3c-a118-4ac490f34ec5',
                            message: null,
                            error: null,
                            data: {
                                workDays: ['SATURDAY', 'SUNDAY'],
                                workShift: ['MORNING', 'AFTERNOON'],
                                services: ['[object Object]'],
                                id: '9705690b-45d9-4d3c-a118-4ac490f34ec5',
                                firstName: 'Nguyen',
                                lastName: 'Khoi',
                                email: 'nguyenvukhoi150402@gmail.com',
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
                            path: '/api/booking/employee/find/d4112320-a998-4ff5-ba84-b31514f43bc6',
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
                            path: '/api/booking/employee/find/d4112320-a998-4ff5-ba84-b31514f43bc6',
                            message: 'Category not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async findOneEmployee(@Req() req: Request, @Param() params: FindOneEmployeeRequest) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.bookingEmployeeService.findOneEmployee({
            user: userData,
            ...params,
        } as FindOneEmployeeRequestDTO);
    }

    @Get('search')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Search one employee',
        description: `
## Use access token
## Use query`,
    })
    @ApiQuery({
        name: 'firstName',
        description: 'First name of employee',
        required: false,
        example: 'Nguyen',
    })
    @ApiQuery({
        name: 'lastName',
        description: 'Last name of employee',
        required: false,
        example: 'Khoi',
    })
    @ApiQuery({
        name: 'email',
        description: 'Email of employee',
        required: false,
        example: 'nguyenvukhoi150402@gmail.com',
    })
    @ApiQuery({
        name: 'workDays',
        description:
            'Array of workDays. Repeat the parameter for each value with square brackets (e.g., workDays[]=SUNDAY&workDays[]=FRIDAY).',
        required: true,
        enum: WorkDays,
        isArray: true,
        example: 'workDays[]=SUNDAY&workDays[]=FRIDAY',
    })
    @ApiQuery({
        name: 'workShift',
        description:
            'Array of workShift. Repeat the parameter for each value with square brackets (e.g., workShift[]=MORNING&workShift[]=AFTERNOON).',
        required: true,
        enum: WorkShift,
        isArray: true,
        example: 'workShift[]=MORNING&workShift[]=AFTERNOON',
    })
    @ApiQuery({
        name: 'services',
        description:
            'Array of services. Repeat the parameter for each value with square brackets).',
        required: true,
        isArray: true,
        example: 'services[]=85351665-9e0a-41b4-9792-9001210f85f4',
    })
    @ApiCreatedResponse({
        description: 'Find one service successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after find one service successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-10T09:08:38.856Z',
                            path: '/api/booking/employee/search?workDays[]=SUNDAY&workShift[]=MORNING&services[]=85351665-9e0a-41b4-9792-9001210f85f4&workDays[]=SUNDAY&firstName=Nguyen&lastName=Khoi&email=nguyenvukhoi150402@gmai.com',
                            message: null,
                            error: null,
                            data: {
                                employees: [
                                    {
                                        workDays: ['SATURDAY', 'SUNDAY'],
                                        workShift: ['MORNING', 'AFTERNOON'],
                                        services: ['[object Object]'],
                                        id: '9705690b-45d9-4d3c-a118-4ac490f34ec5',
                                        firstName: 'Nguyen',
                                        lastName: 'Khoi',
                                        email: 'nguyenvukhoi150402@gmail.com',
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
                            path: '/api/booking/employee/search?workDays[]=SUNDAY&workShift[]=MORNING&services[]=879101c7-7397-4e57-b196-b494acb6a76b&name=Ca%201',
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
                            path: '/api/booking/employee/search?workDays[]=SUNDAY&workShift[]=MORNING&services[]=879101c7-7397-4e57-b196-b494acb6a76b&name=Ca%201',
                            message: 'Category not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async findEmployee(@Req() req: Request, @Query() query: FindEmployee) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(query);
        return await this.bookingEmployeeService.findEmployee({
            user: userData,
            ...query,
        } as FindEmployeeRequestDTO);
    }

    @Post('update')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Update employee of domain',
        description: `
## Use access token
## Must use tenant account
## Return new employee with update data`,
    })
    @ApiBody({
        type: UpdateEmployee,
        examples: {
            category_1: {
                value: {} as UpdateEmployee,
            },
        },
    })
    @ApiCreatedResponse({
        description: 'Update employee successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after Update employee successfully',
                        value: {
                            statusCode: 201,
                            timestamp: '2024-05-08T18:57:45.555Z',
                            path: '/api/booking/employee/update',
                            message: null,
                            error: null,
                            data: {
                                id: 'f49ae4e8-8c65-4a8f-a584-efb185a95beb',
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
                            path: '/api/booking/employee/update',
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
                            path: '/api/booking/employee/update',
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
                            path: '/api/booking/employee/update',
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
                            path: '/api/booking/employee/create',
                            message: 'Category already exists',
                            error: 'Forbidden',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async updateEmployee(@Req() req: Request, @Body() data: UpdateEmployee) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, data)
        return await this.bookingEmployeeService.createEmployee({
            user: userData,
            ...data,
        } as UpdateEmployeeRequestDTO);
    }

    @Delete('delete/:id')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiOperation({
        summary: 'Delete one employee',
        description: `
## Use access token
## Must be TENANT`,
    })
    @ApiParam({
        name: 'id',
        description: 'ID of the employee',
        example: 'd4112320-a998-4ff5-ba84-b31514f43bc6',
        required: true,
    })
    @ApiCreatedResponse({
        description: 'Delete one service successfully!!',
        content: {
            'application/json': {
                examples: {
                    signin: {
                        summary: 'Response after delete employee successfully',
                        value: {
                            statusCode: 200,
                            timestamp: '2024-05-08T18:34:29.532Z',
                            path: '/api/booking/employee/delete/d4112320-a998-4ff5-ba84-b31514f43bc6',
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
                            path: '/api/booking/employee/delete/d4112320-a998-4ff5-ba84-b31514f43bc6',
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
                            path: '/api/booking/employee/delete/d4112320-a998-4ff5-ba84-b31514f43bc6',
                            message: 'Category not found',
                            error: 'Unauthorized',
                            data: null,
                        },
                    },
                },
            },
        },
    })
    async deleteEmployee(@Req() req: Request, @Param() param: DeleteEmployee) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.bookingEmployeeService.deleteEmployee({
            user: userData,
            ...param,
        } as DeleteEmployeeRequestDTO);
    }
}
