import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsBase64,
    IsDateString,
    IsEnum,
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
import {DateTypeEnum} from 'src/common/enums/dateType.enum';
import { StatusBooking } from 'src/common/enums/statusBooking.enum';
import { BadRequestException } from 'src/common/exceptions/exceptions';
import { IsBase64DataURI } from 'src/common/validator/is-base-64-dataURI.validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { CreateBookingRequest } from 'src/proto_build/booking/booking/CreateBookingRequest';
import {DateType} from 'src/proto_build/booking/booking/DateType';
import { DeleteBookingRequest } from 'src/proto_build/booking/booking/DeleteBookingRequest';
import { FindAllBookingRequest } from 'src/proto_build/booking/booking/FindAllBookingRequest';
import { FindOneRequest } from 'src/proto_build/booking/booking/FindOneRequest';
import { FindSlotBookingsRequest } from 'src/proto_build/booking/booking/FindSlotBookingsRequest';
import { GetBookingsValueByDateTypeRequest } from 'src/proto_build/booking/booking/GetBookingsValueByDateTypeRequest';
import { UpdateStatusBookingRequest } from 'src/proto_build/booking/booking/UpdateStatusBookingRequest';

export class CreateBooking implements CreateBookingRequest {
    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    date: string;

    @IsUUID('all')
    @IsNotEmpty()
    @ApiProperty()
    service: string;

    @IsUUID('all')
    @IsOptional()
    @ApiProperty()
    employee: string;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    startTime: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    note: string = 'Default note';

    @IsUUID()
    @IsOptional()
    @ApiProperty()
    voucher: string;
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

    @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'startTime must be a valid time in the format HH:mm (24-hour format)',
    })
    @IsOptional()
    @ApiProperty()
    startTime: string;

    @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'endTime must be a valid time in the format HH:mm (24-hour format)',
    })
    @IsOptional()
    @ApiProperty()
    endTime: string;
}

export class FindSlotBookingsRequestDTO extends FindSlotBookings {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class UpdateStatusBooking implements UpdateStatusBookingRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsString()
    @IsEnum(StatusBooking, { message: 'Must be a valid status: PENDING, SUCCESSS, CANCEL' })
    @IsNotEmpty()
    @ApiProperty()
    status: string;
}

export class UpdateStatusBookingRequestDTO extends UpdateStatusBooking {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class DeleteBooking implements DeleteBookingRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    note: string;
}

export class DeleteBookingRequestDTO extends DeleteBooking {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindAllBooking implements FindAllBookingRequest {
    @IsArray()
    @IsUUID('all', { each: true })
    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
    @ApiProperty()
    services: string[];

    @IsArray()
    @IsOptional()
    @IsEnum(StatusBooking, { each: true })
    @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
    @ApiProperty()
    status: StatusBooking[];

    @IsArray()
    @ArrayMinSize(2)
    @IsDateString({ strict: false }, { each: true })
    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
    @ApiProperty()
    date: string[];

    @IsInt()
    @IsPositive()
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @ApiProperty()
    page: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @ApiProperty()
    limit: number;
}

export class FindAllBookingRequestDTO extends FindAllBooking {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

const dateTypeMaping: Record<DateTypeEnum, number> = {
    [DateTypeEnum.WEEK]: 0,
    [DateTypeEnum.MONTH]: 1,
    [DateTypeEnum.YEAR]: 2,
};

export class GetBookingsValueByDateType implements GetBookingsValueByDateTypeRequest {
    @IsNotEmpty()
    @Transform(({ value }) => {
        const numValue = dateTypeMaping[value as DateTypeEnum];
        if (numValue === undefined) {
            throw new BadRequestException(
                `Invalid type: ${value}. Must be one of: ${Object.keys(DateTypeEnum).join(', ')}`,
                'Bad request',
            );
        }
        return numValue;
    })
    @ApiProperty({
        enum: DateTypeEnum,
        enumName: 'DateTypeEnum',
        description: 'DateTypeEnum of the subscription',
        example: DateTypeEnum.WEEK,
    })
    type: DateType;
}

export class GetBookingsValueByDateTypeRequestDTO extends GetBookingsValueByDateType {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
