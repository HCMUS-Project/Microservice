import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsBase64,
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    IsUppercase,
    Matches,
    Max,
    Min,
    ValidateNested,
    isArray,
} from 'class-validator';
import { IsBase64DataURI } from 'src/common/validator/is-base-64-dataURI.validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { CreateBookingRequest } from 'src/proto_build/booking/booking/CreateBookingRequest';
import { FindOneRequest } from 'src/proto_build/booking/booking/FindOneRequest';
import { FindSlotBookingsRequest } from 'src/proto_build/booking/booking/FindSlotBookingsRequest';

export class CreateBooking implements CreateBookingRequest {
    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    date: string;

    @IsUUID('all')
    @IsNotEmpty()
    @ApiProperty()
    service: string;

    // @IsUUID('all')
    // @IsOptional()
    // @ApiProperty()
    // employee: string;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    startTime: string;

    @IsString()
    @IsOptional() 
    @ApiProperty()
    note: string = 'Default note';
}

export class CreateBookingRequestDTO extends CreateBooking {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindOne implements FindOneRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class FindOneRequestDTO extends FindOne {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindSlotBookings implements FindSlotBookingsRequest {
    // @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    //     message: 'date must be a valid date in the format yyyy-mm-dd',
    // })
    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    date: string;

    @IsUUID('all')
    @IsNotEmpty()
    @ApiProperty()
    service: string;

    // @IsUUID('all')
    // @IsOptional()
    // @ApiProperty()
    // employee: string;

    // @IsDateString()
    // @IsOptional()
    // @ApiProperty()
    // startTime: string;

    // @IsDateString()
    // @IsOptional()
    // @ApiProperty()
    // endTime: string;
}

export class FindSlotBookingsRequestDTO extends FindSlotBookings {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
