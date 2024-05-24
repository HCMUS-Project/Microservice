import {
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';

import { Observable, firstValueFrom } from 'rxjs';

import { ClientGrpc } from '@nestjs/microservices';
import { UserNotFoundException } from 'src/common/exceptions/exceptions';

import {
    CreateBookingRequestDTO,
    FindOneRequestDTO,
    FindSlotBookingsRequestDTO,
} from './booking.dto';
import { CreateBookingResponse } from 'src/proto_build/booking/booking/CreateBookingResponse';
import { FindOneResponse } from 'src/proto_build/booking/booking/FindOneResponse';
import { FindSlotBookingsResponse } from 'src/proto_build/booking/booking/FindSlotBookingsResponse';

interface BookingService {
    createBooking(data: CreateBookingRequestDTO): Observable<CreateBookingResponse>;
    findOne(data: FindOneRequestDTO): Observable<FindOneResponse>;
    findSlotBookings(data: FindSlotBookingsRequestDTO): Observable<FindSlotBookingsResponse>;
}

@Injectable()
export class BookingBookingsService implements OnModuleInit {
    private iBookingService: BookingService;

    constructor(@Inject('GRPC_ECOMMERCE_BOOKING') private client: ClientGrpc) {}

    onModuleInit() {
        this.iBookingService = this.client.getService<BookingService>('BookingService');
        // console.log(this.iProductService)
    }

    async createBooking(data: CreateBookingRequestDTO): Promise<CreateBookingResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const createBookingResponse: CreateBookingResponse = await firstValueFrom(
                this.iBookingService.createBooking(data),
            );
            return createBookingResponse;
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
            } else if (errorDetails.error == 'SERVICE_NOT_FOUND') {
                throw new UserNotFoundException('Service not found');
            } else if (errorDetails.error == 'NO_EMPLOYEE') {
                throw new ForbiddenException('None of employee available for booking', 'Forbidden');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async findOne(data: FindOneRequestDTO): Promise<FindOneResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const findOneResponse: FindOneResponse = await firstValueFrom(
                this.iBookingService.findOne(data),
            );
            return findOneResponse;
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
            } else if (errorDetails.error == 'BOOKING_NOT_FOUND') {
                throw new UserNotFoundException('Booking not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async findSlotBookings(data: FindSlotBookingsRequestDTO): Promise<FindSlotBookingsResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const findSlotBookingsResponse: FindSlotBookingsResponse = await firstValueFrom(
                this.iBookingService.findSlotBookings(data),
            );
            return findSlotBookingsResponse;
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
            } else if (errorDetails.error == 'SERVICE_NOT_FOUND') {
                throw new UserNotFoundException('Service not found');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    // async deleteService(data: DeleteServiceRequestDTO): Promise<DeleteServiceResponse> {
    //     try {
    //         // console.log(this.iProductService.createProduct(data));
    //         const deleteServiceResponse: DeleteServiceResponse = await firstValueFrom(
    //             this.iServicesService.deleteService(data),
    //         );
    //         return deleteServiceResponse;
    //     } catch (e) {
    //         // console.log(e)
    //         const errorDetails = JSON.parse(e.details);
    //         // console.log(errorDetails);
    //         if (errorDetails.error == 'PERMISSION_DENIED') {
    //             throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
    //         } else if (errorDetails.error == 'PRODUCT_ALREADY_EXISTS') {
    //             throw new ForbiddenException('Product already exists', 'Forbidden');
    //         } else {
    //             throw new NotFoundException(
    //     `Unhandled error type: ${errorDetails.error}`,
    //     'Error not recognized',
    // );
    //         }
    //     }
    // }

    // async updateService(data: UpdateServiceRequestDTO): Promise<UpdateServiceResponse> {
    //     try {
    //         // console.log(this.iProductService.createProduct(data));
    //         const updateServiceResponse: UpdateServiceResponse = await firstValueFrom(
    //             this.iServicesService.updateService(data),
    //         );
    //         return updateServiceResponse;
    //     } catch (e) {
    //         // console.log(e)
    //         const errorDetails = JSON.parse(e.details);
    //         // console.log(errorDetails);
    //         if (errorDetails.error == 'PERMISSION_DENIED') {
    //             throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
    //         } else if (errorDetails.error == 'PRODUCT_ALREADY_EXISTS') {
    //             throw new ForbiddenException('Product already exists', 'Forbidden');
    //         } else {
    //             throw new NotFoundException(errorDetails, 'Not found');
    //         }
    //     }
    // }
}
