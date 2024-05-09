import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { BookingServicesService } from './services/services.service';
import { ServicesController } from './services/services.controller';
import { EmployeeController } from './employee/employee.controller';
import { BookingEmployeeService } from './employee/employee.service';
import {BookingsController} from './booking/booking.controller';
import {BookingBookingsService} from './booking/booking.service';

@Module({
    imports: [ClientsModule],
    controllers: [ServicesController, EmployeeController, BookingsController],
    providers: [
        {
            provide: 'GRPC_ECOMMERCE_BOOKING_SERVICES',
            useClass: BookingServicesService,
        },
        {
            provide: 'GRPC_ECOMMERCE_BOOKING_EMPLOYEE',
            useClass: BookingEmployeeService,
        },
        {
            provide: 'GRPC_ECOMMERCE_BOOKING_BOOKINGS',
            useClass: BookingBookingsService,
        },
        {
            provide: 'GRPC_ECOMMERCE_BOOKING',
            useFactory: (configService: ConfigService) => {
                return ClientProxyFactory.create({
                    transport: Transport.GRPC,
                    options: {
                        package: [
                            'bookingService',
                            'booking',
                            'userToken',
                            'employee',
                            'review',
                            'services',
                            'voucher',
                        ],
                        protoPath: join(
                            __dirname,
                            '../../../src/proto/booking/bookingService.proto',
                        ),
                        url: configService.get<string>('BOOKING_SERVICE_URL'),
                        loader: {
                            enums: String,
                            objects: true,
                            arrays: true,
                        },
                    },
                });
            },
            inject: [ConfigService],
        },
    ],
})
export class BookingModule {}
