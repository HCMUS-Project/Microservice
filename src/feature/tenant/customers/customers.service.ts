import { Observable, firstValueFrom, lastValueFrom, take, toArray } from 'rxjs';
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ForbiddenException, UserNotFoundException } from 'src/common/exceptions/exceptions';
import { PolicyAndTermResponse } from 'src/proto_build/tenant/policyAndTerm/PolicyAndTermResponse';
import { GetAllBookingsOrdersNumbersRequestDTO } from './customers.dto.';
import { GetAllBookingsOrdersNumbersResponse } from 'src/proto_build/tenant/customers/GetAllBookingsOrdersNumbersResponse';

interface CustomersService {
    getAllBookingsOrdersNumbers(
        data: GetAllBookingsOrdersNumbersRequestDTO,
    ): Observable<GetAllBookingsOrdersNumbersResponse>;
}

@Injectable()
export class TenantCustomersService implements OnModuleInit {
    private iCustomersService: CustomersService;

    constructor(@Inject('GRPC_TENANT_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iCustomersService = this.client.getService<CustomersService>('CustomersService');
    }

    async getAllBookingsOrdersNumbers(
        data: GetAllBookingsOrdersNumbersRequestDTO,
    ): Promise<GetAllBookingsOrdersNumbersResponse> {
        try {
            // console.log(this.iPolicyAndTermService.createTenant(data));
            const response: GetAllBookingsOrdersNumbersResponse = await firstValueFrom(
                this.iCustomersService.getAllBookingsOrdersNumbers(data),
            );
            return response;
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
            } else if (errorDetails.error == 'POLICY_AND_TERM_ALREADY_EXISTS') {
                throw new ForbiddenException('Policy and term already exists', 'Forbidden');
            } else if (errorDetails.error == 'INVALID_TENANT_ID') {
                throw new ForbiddenException('Invalid tenant id', 'Forbidden');
            } else {
                throw new NotFoundException(e, 'Not found');
            }
        }
    }
}
