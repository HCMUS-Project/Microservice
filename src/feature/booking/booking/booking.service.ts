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
    DeleteBookingRequestDTO,
    FindAllBookingRequestDTO,
    FindOneRequestDTO,
    FindSlotBookingsRequestDTO,
    GetBookingsValueByDateTypeRequestDTO,
    UpdateStatusBookingRequestDTO,
} from './booking.dto';
import { CreateBookingResponse } from 'src/proto_build/booking/booking/CreateBookingResponse';
import { FindOneResponse } from 'src/proto_build/booking/booking/FindOneResponse';
import { FindSlotBookingsResponse } from 'src/proto_build/booking/booking/FindSlotBookingsResponse';
import { DeleteBookingResponse } from 'src/proto_build/booking/booking/DeleteBookingResponse';
import { FindAllBookingResponse } from 'src/proto_build/booking/booking/FindAllBookingResponse';
import { GetBookingsValueByDateTypeResponse } from 'src/proto_build/booking/booking/GetBookingsValueByDateTypeResponse';

interface BookingService {
    createBooking(data: CreateBookingRequestDTO): Observable<CreateBookingResponse>;
    findOne(data: FindOneRequestDTO): Observable<FindOneResponse>;
    findSlotBookings(data: FindSlotBookingsRequestDTO): Observable<FindSlotBookingsResponse>;
    updateStatusBooking(data: UpdateStatusBookingRequestDTO): Observable<FindOneResponse>;
    deleteBooking(data: DeleteBookingRequestDTO): Observable<DeleteBookingResponse>;
    findAllBooking(data: FindAllBookingRequestDTO): Observable<FindAllBookingResponse>;
    getBookingsValueByDateType(
        data: GetBookingsValueByDateTypeRequestDTO,
    ): Observable<GetBookingsValueByDateTypeResponse>;
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
                throw new ForbiddenException('Service not found');
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
                throw new ForbiddenException('Booking not found');
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
                throw new ForbiddenException('Service not found');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async updateStatusBooking(data: UpdateStatusBookingRequestDTO): Promise<FindOneResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const findOneResponse: FindOneResponse = await firstValueFrom(
                this.iBookingService.updateStatusBooking(data),
            );
            return findOneResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'BOOKING_NOT_FOUND') {
                throw new ForbiddenException('Booking not found');
            } else if (errorDetails.error == 'BOOKING_CANNOT_UPDATE_STATUS') {
                throw new ForbiddenException('Booking cant update status');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async deleteBooking(data: DeleteBookingRequestDTO): Promise<DeleteBookingResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const deleteBookingResponse: DeleteBookingResponse = await firstValueFrom(
                this.iBookingService.deleteBooking(data),
            );
            return deleteBookingResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'BOOKING_NOT_FOUND') {
                throw new ForbiddenException('Booking not found');
            } else if (errorDetails.error == 'BOOKING_CANNOT_DELETE') {
                throw new ForbiddenException('Booking cant delete becasue not PENDING');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async findAllBooking(data: FindAllBookingRequestDTO): Promise<FindAllBookingResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const findAllBookingResponse: FindAllBookingResponse = await firstValueFrom(
                this.iBookingService.findAllBooking(data),
            );
            return findAllBookingResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async getBookingsValueByDateType(
        data: GetBookingsValueByDateTypeRequestDTO,
    ): Promise<GetBookingsValueByDateTypeResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const response: GetBookingsValueByDateTypeResponse = await firstValueFrom(
                this.iBookingService.getBookingsValueByDateType(data),
            );
            return response;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }
}
