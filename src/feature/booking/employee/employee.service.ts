import {
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { UserNotFoundException } from 'src/common/exceptions/exceptions';
import { Observable, firstValueFrom } from 'rxjs';
import {
    CreateEmployeeRequestDTO,
    DeleteEmployeeRequestDTO,
    FindEmployeeRequestDTO,
    FindOneEmployeeRequestDTO,
    UpdateEmployeeRequestDTO,
} from './employee.dto';
import { CreateEmployeeResponse } from 'src/proto_build/booking/employee/CreateEmployeeResponse';
import { FindEmployeeResponse } from 'src/proto_build/booking/employee/FindEmployeeResponse';
import { FindOneEmployeeResponse } from 'src/proto_build/booking/employee/FindOneEmployeeResponse';
import { UpdateEmployeeResponse } from 'src/proto_build/booking/employee/UpdateEmployeeResponse';
import { DeleteEmployeeResponse } from 'src/proto_build/booking/employee/DeleteEmployeeResponse';

interface EmployeeService {
    createEmployee(data: CreateEmployeeRequestDTO): Observable<CreateEmployeeResponse>;
    findEmployee(data: FindEmployeeRequestDTO): Observable<FindEmployeeResponse>;
    findOneEmployee(data: FindOneEmployeeRequestDTO): Observable<FindOneEmployeeResponse>;
    updateEmployee(data: UpdateEmployeeRequestDTO): Observable<UpdateEmployeeResponse>;
    deleteEmployee(data: DeleteEmployeeRequestDTO): Observable<DeleteEmployeeResponse>;
}

@Injectable()
export class BookingEmployeeService implements OnModuleInit {
    private iEmployeeService: EmployeeService;

    constructor(@Inject('GRPC_ECOMMERCE_BOOKING') private client: ClientGrpc) {}

    onModuleInit() {
        this.iEmployeeService = this.client.getService<EmployeeService>('EmployeeService');
        // console.log(this.iProductService)
    }

    async createEmployee(data: CreateEmployeeRequestDTO): Promise<CreateEmployeeResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const createEmployeeResponse: CreateEmployeeResponse = await firstValueFrom(
                this.iEmployeeService.createEmployee(data),
            );
            return createEmployeeResponse;
        } catch (e) {
            // console.log(e)
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'INVALID_WORK_DAYS') {
                throw new ForbiddenException('Invalid work days', 'Forbidden');
            } else if (errorDetails.error == 'INVALID_WORK_SHIFTS') {
                throw new ForbiddenException('Invalid work shifts', 'Forbidden');
            } else if (errorDetails.error == 'DUPLICATE_WORK_DAYS') {
                throw new ForbiddenException('Duplicate work days', 'Forbidden');
            } else if (errorDetails.error == 'DUPLICATE_WORK_SHIFTS') {
                throw new ForbiddenException('Duplicate work shifts', 'Forbidden');
            } else if (errorDetails.error == 'SERVICES_NOT_FOUND') {
                throw new UserNotFoundException('Services not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async findOneEmployee(data: FindOneEmployeeRequestDTO): Promise<FindOneEmployeeResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const findOneEmployeeResponse: FindOneEmployeeResponse = await firstValueFrom(
                this.iEmployeeService.findOneEmployee(data),
            );
            return findOneEmployeeResponse;
        } catch (e) {
            // console.log(e)
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'EMPLOYEE_NOT_FOUND') {
                throw new UserNotFoundException('Employee not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async findEmployee(data: FindEmployeeRequestDTO): Promise<FindEmployeeResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const findEmployeeResponse: FindEmployeeResponse = await firstValueFrom(
                this.iEmployeeService.findEmployee(data),
            );
            return findEmployeeResponse;
        } catch (e) {
            // console.log(e)
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);

            throw new NotFoundException(
                `Unhandled error type: ${errorDetails.error}`,
                'Error not recognized',
            );
        }
    }

    async updateEmployee(data: UpdateEmployeeRequestDTO): Promise<UpdateEmployeeResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const updateEmployeeResponse: UpdateEmployeeResponse = await firstValueFrom(
                this.iEmployeeService.updateEmployee(data),
            );
            return updateEmployeeResponse;
        } catch (e) {
            // console.log(e)
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'INVALID_WORK_DAYS') {
                throw new ForbiddenException('Invalid work days', 'Forbidden');
            } else if (errorDetails.error == 'INVALID_WORK_SHIFTS') {
                throw new ForbiddenException('Invalid work shifts', 'Forbidden');
            } else if (errorDetails.error == 'DUPLICATE_WORK_DAYS') {
                throw new ForbiddenException('Duplicate work days', 'Forbidden');
            } else if (errorDetails.error == 'DUPLICATE_WORK_SHIFTS') {
                throw new ForbiddenException('Duplicate work shifts', 'Forbidden');
            } else if (errorDetails.error == 'SERVICES_NOT_FOUND') {
                throw new UserNotFoundException('Services not found');
            } else if (errorDetails.error == 'EMPLOYEE_NOT_FOUND') {
                throw new UserNotFoundException('Employee not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async deleteEmployee(data: DeleteEmployeeRequestDTO): Promise<DeleteEmployeeResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const deleteEmployeeResponse: DeleteEmployeeResponse = await firstValueFrom(
                this.iEmployeeService.deleteEmployee(data),
            );
            return deleteEmployeeResponse;
        } catch (e) {
            // console.log(e)
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'EMPLOYEE_NOT_FOUND') {
                throw new UserNotFoundException('Employee not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }
}
