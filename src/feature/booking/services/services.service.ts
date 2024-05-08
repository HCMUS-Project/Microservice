import {
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';
import {CreateServiceRequestDTO, DeleteServiceRequestDTO, FindOneRequestDTO, FindServicesRequestDTO} from './services.dto';
import {Observable, firstValueFrom} from 'rxjs';
import {CreateServiceResponse} from 'src/proto_build/booking/services/CreateServiceResponse';
import {FindOneResponse} from 'src/proto_build/booking/services/FindOneResponse';
import {FindServicesResponse} from 'src/proto_build/booking/services/FindServicesResponse';
import {DeleteServiceResponse} from 'src/proto_build/booking/services/DeleteServiceResponse';
import {ClientGrpc} from '@nestjs/microservices';
import {UserNotFoundException} from 'src/common/exceptions/exceptions';
 

interface ServicesService {
    createService(data: CreateServiceRequestDTO): Observable<CreateServiceResponse>;
    findOne(data: FindOneRequestDTO): Observable<FindOneResponse>;
    findServices(data: FindServicesRequestDTO): Observable<FindServicesResponse>;
    deleteService(data: DeleteServiceRequestDTO): Observable<DeleteServiceResponse>;
}

@Injectable()
export class BookingServicesService implements OnModuleInit {
    private iServicesService: ServicesService;

    constructor(@Inject('GRPC_ECOMMERCE_BOOKING') private client: ClientGrpc) {}

    onModuleInit() {
        this.iServicesService = this.client.getService<ServicesService>('ServicesService');
        // console.log(this.iProductService)
    }

    async createService(data: CreateServiceRequestDTO): Promise<CreateServiceResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const createServiceResponse: CreateServiceResponse = await firstValueFrom(
                this.iServicesService.createService(data),
            );
            return createServiceResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'PRODUCT_ALREADY_EXISTS') {
                throw new ForbiddenException('Product already exists', 'Forbidden');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async findOne(data: FindOneRequestDTO): Promise<FindOneResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const findOneResponse: FindOneResponse = await firstValueFrom(
                this.iServicesService.findOne(data),
            );
            return findOneResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'PRODUCT_ALREADY_EXISTS') {
                throw new ForbiddenException('Product already exists', 'Forbidden');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async findServices(data: FindServicesRequestDTO): Promise<FindServicesResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const findServicesResponse: FindServicesResponse = await firstValueFrom(
                this.iServicesService.findServices(data),
            );
            return findServicesResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'PRODUCT_ALREADY_EXISTS') {
                throw new ForbiddenException('Product already exists', 'Forbidden');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async deleteService(data: DeleteServiceRequestDTO): Promise<DeleteServiceResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const deleteServiceResponse: DeleteServiceResponse = await firstValueFrom(
                this.iServicesService.deleteService(data),
            );
            return deleteServiceResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'PRODUCT_ALREADY_EXISTS') {
                throw new ForbiddenException('Product already exists', 'Forbidden');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }
}
