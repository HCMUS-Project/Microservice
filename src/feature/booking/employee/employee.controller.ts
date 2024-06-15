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
import {
    ApiBodyExample,
    ApiEndpoint,
    ApiErrorResponses,
    ApiParamExamples,
    ApiQueryExamples,
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';
import { query } from 'express';

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
    @ApiEndpoint({
        summary: `Create an Employee`,
        details: `
## Description
Create an Employee within a domain using an access token. This operation is restricted to tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
`,
    })
    @ApiBodyExample(CreateEmployee, {
        firstName: 'Nguyen',
        lastName: 'Khoi',
        email: 'nguyenvukhoi150402@gmail.com',
        workDays: ['SATURDAY', 'SUNDAY'],
        workShift: ['MORNING', 'AFTERNOON'],
        services: ['2489bc57-5382-46a3-a03b-4276335261db'],
    })
    @ApiResponseExample(
        'create',
        'create Employee',
        { id: 'edcc4096-3d88-4815-8e38-a87938b1e49d' },
        '/api/booking/employee/create',
    )
    @ApiErrorResponses('/api/booking/employee/create', '/api/booking/employee/create', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'firstName should not be empty, firstName must be a string, lastName should not be empty, lastName must be a string, email should not be empty, email must be an email, each value in workDays must be one of the following values: SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, workDays must contain at least 1 elements, workDays should not be empty, workDays must be an array, each value in workShift must be one of the following values: MORNING, AFTERNOON, EVENING, NIGHT, workShift must contain at least 1 elements, workShift should not be empty, workShift must be an array, each value in services must be a UUID, services must contain at least 1 elements, services should not be empty, services must be an array',
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
                key: 'invalid_work_days',
                summary: 'Invalid work days',
                detail: 'Invalid work days',
            },
            {
                key: 'invalid_work_shifts',
                summary: 'Invalid work shifts',
                detail: 'Invalid work shifts',
            },
            {
                key: 'duplicate_work_days',
                summary: 'Duplicate work days',
                detail: 'Duplicate work days',
            },
            {
                key: 'duplicate_work_shifts',
                summary: 'Invalid work shifts',
                detail: 'Invalid work shifts',
            },
        ],
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

    @Get('find')
    @ApiEndpoint({
        summary: `Find one employee by Id and domain`,
        details: `
## Description
Find an employee within a domain.
## Requirements
`,
    })
    @ApiQueryExamples([
        {
            name: 'id',
            description: 'ID of an employee',
            example: 'edcc4096-3d88-4815-8e38-a87938b1e49d',
            required: false,
        },
        {
            name: 'domain',
            description: 'domain of service',
            example: '30shine.com',
            required: true,
        },
    ])
    @ApiResponseExample(
        'read',
        'find an employee by Id',
        {
            workDays: ['FRIDAY', 'THURSDAY'],
            workShift: ['MORNING', 'EVENING'],
            services: [
                {
                    id: '2489bc57-5382-46a3-a03b-4276335261db',
                    name: 'Cat toc',
                },
            ],
            id: '5e264b60-1f69-4db5-b09b-5718fff6931d',
            firstName: 'Vo',
            lastName: 'Hoai',
            email: 'volehoai@gmail.com',
        },
        '/api/booking/employee/find/?domain=30shine.com&id=53f49d2f-436b-465f-b541-538e90c32a7f',
    )
    @ApiErrorResponses(
        '/api/booking/employee/find',
        '/api/booking/employee/find/?domain=30shine.com&id=53f49d2f-436b-465f-b541-538e90c32a7f',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'domain should not be empty, domain must be a URL address',
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
                    summary: 'Employee not found',
                    detail: 'Employee not found',
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
    async findOneEmployee(@Req() req: Request, @Query() query: FindOne) {
        if (query.id !== undefined)
            return await this.bookingEmployeeService.findOneEmployee({
                id: query.id,
            } as FindOneEmployeeRequestDTO);
        else
            return await this.bookingEmployeeService.findEmployee({
                domain: query.domain,
            } as FindEmployeeRequestDTO);
    }

    @Get('search')
    @ApiEndpoint({
        summary: `Find Employees by condition`,
        details: `
## Description
Find Employess within a domain.
## Requirements 
- Must has **services** in query to find all **employee** can do service.
- API will return the result with **match all data in field of employee**.
- Example: employee A has shift **[MORNING, EVENING]**. Query **workShift=MORNING** will return A
- but return **none** with query is **workShift=MORNING&workShift=AFTERNOON**.
`,
    })
    @ApiQueryExamples([
        {
            name: 'domain',
            description: 'domain',
            required: true,
            example: '30shine.com',
        },
        {
            name: 'firstName',
            description: 'First name of employee',
            required: false,
            example: 'Nguyen',
        },
        {
            name: 'lastName',
            description: 'Last name of employee',
            required: false,
            example: 'Khoi',
        },
        {
            name: 'email',
            description: 'Email of employee',
            required: false,
            example: 'nguyenvukhoi150402@gmail.com',
        },
        {
            name: 'workDays',
            description:
                'Array of workDays. Repeat the parameter for each value with square brackets (e.g., workDays[]=SUNDAY&workDays[]=FRIDAY).',
            required: false,
            enum: WorkDays,
            isArray: true,
            example: 'workDays=SUNDAY&workDays=FRIDAY',
        },
        {
            name: 'workShift',
            description:
                'Array of workShift. Repeat the parameter for each value with square brackets (e.g., workShift[]=MORNING&workShift[]=AFTERNOON).',
            required: false,
            enum: WorkShift,
            isArray: true,
            example: 'workShift=MORNING&workShift=AFTERNOON',
        },
        {
            name: 'services',
            description:
                'Array of services. Repeat the parameter for each value with square brackets).',
            required: false,
            isArray: true,
            example: 'services=85351665-9e0a-41b4-9792-9001210f85f4',
        },
    ])
    @ApiResponseExample(
        'read',
        'find employees by condition',
        {
            employees: [
                {
                    workDays: ['SATURDAY', 'SUNDAY'],
                    workShift: ['MORNING', 'AFTERNOON'],
                    services: [
                        {
                            id: '2489bc57-5382-46a3-a03b-4276335261db',
                            name: 'Cat toc',
                        },
                    ],
                    id: 'edcc4096-3d88-4815-8e38-a87938b1e49d',
                    firstName: 'Nguyen',
                    lastName: 'Khoi',
                    email: 'nguyenvukhoi150402@gmail.com',
                },
            ],
        },
        '/api/booking/employee/search?services=2489bc57-5382-46a3-a03b-4276335261db&workDays=SUNDAY&firstName=Nguyen&lastName=Khoi&email=nguyenvukhoi150402@gmai.com&workShift=MORNING',
    )
    @ApiErrorResponses(
        '/api/booking/employee/search?services&firstName&lastName&email&workDays&workShift',
        '/api/booking/employee/search?services=2489bc57-5382-46a3-a03b-4276335261db&workDays=SUNDAY&firstName=Nguyen&lastName=Khoi&email=nguyenvukhoi150402@gmai.com&workShift=MORNING',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'email must be an email, each value in workDays must be one of the following values: SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, each value in workShift must be one of the following values: MORNING, AFTERNOON, EVENING, NIGHT, each value in services must be a UUID',
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
            ],
        },
    )
    async findEmployee(@Req() req: Request, @Query() query: FindEmployee) {
        // const payloadToken = req['user'];
        // const header = req.headers;
        // const userData = {
        //     email: payloadToken.email,
        //     domain: payloadToken.domain,
        //     role: payloadToken.role,
        //     accessToken: payloadToken.accessToken,
        // } as UserDto;
        // console.log(query);
        return await this.bookingEmployeeService.findEmployee({
            // user: userData,
            ...query,
        } as FindEmployeeRequestDTO);
    }

    @Post('update')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Update an employee`,
        details: `
## Description
Update an employee within a domain using an access token. This operation is restricted to tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
`,
    })
    @ApiBodyExample(UpdateEmployee, {
        firstName: 'Nguyen',
        lastName: 'Khoi',
        email: 'nguyenvukhoi150402@gmail.com',
        workDays: ['SATURDAY', 'SUNDAY'],
        workShift: ['MORNING'],
        services: ['2489bc57-5382-46a3-a03b-4276335261db'],
        id: 'edcc4096-3d88-4815-8e38-a87938b1e49d',
    })
    @ApiResponseExample(
        'update',
        'update Employee',
        { id: 'edcc4096-3d88-4815-8e38-a87938b1e49d' },
        '/api/booking/employee/update',
    )
    @ApiErrorResponses('/api/booking/employee/update', '/api/booking/employee/update', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'firstName should not be empty, firstName must be a string, lastName should not be empty, lastName must be a string, email should not be empty, email must be an email, each value in workDays must be one of the following values: SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, workDays must contain at least 1 elements, workDays should not be empty, workDays must be an array, each value in workShift must be one of the following values: MORNING, AFTERNOON, EVENING, NIGHT, workShift must contain at least 1 elements, workShift should not be empty, workShift must be an array, each value in services must be a UUID, services must contain at least 1 elements, services should not be empty, services must be an array, id should not be empty, id must be a UUID',
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
            {
                key: 'employee_not_found',
                summary: 'Employee not found',
                detail: 'Employee not found',
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
                key: 'invalid_work_days',
                summary: 'Invalid work days',
                detail: 'Invalid work days',
            },
            {
                key: 'invalid_work_shifts',
                summary: 'Invalid work shifts',
                detail: 'Invalid work shifts',
            },
            {
                key: 'duplicate_work_days',
                summary: 'Duplicate work days',
                detail: 'Duplicate work days',
            },
            {
                key: 'duplicate_work_shifts',
                summary: 'Invalid work shifts',
                detail: 'Invalid work shifts',
            },
        ],
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
        return await this.bookingEmployeeService.updateEmployee({
            user: userData,
            ...data,
        } as UpdateEmployeeRequestDTO);
    }

    @Delete('delete/:id')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Delete one Employee`,
        details: `
## Description
Delete a Employee within a domain using an access token. This operation is restricted to tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
`,
    })
    @ApiParamExamples([
        {
            name: 'id',
            description: 'ID of an employee',
            example: 'edcc4096-3d88-4815-8e38-a87938b1e49d',
            required: true,
        },
    ])
    @ApiResponseExample(
        'delete',
        'delete an employee by Id',
        { result: 'success' },
        '/api/booking/employee/delete/edcc4096-3d88-4815-8e38-a87938b1e49d',
    )
    @ApiErrorResponses(
        '/api/booking/employee/delete/:id',
        '/api/booking/employee/delete/edcc4096-3d88-4815-8e38-a87938b1e49e',
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
                    summary: 'Employee not found',
                    detail: 'Employee not found',
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
