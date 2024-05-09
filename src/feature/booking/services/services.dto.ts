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
import { CreateServiceRequest } from 'src/proto_build/booking/services/CreateServiceRequest';
import { DeleteServiceRequest } from 'src/proto_build/booking/services/DeleteServiceRequest';
import { FindOneRequest } from 'src/proto_build/booking/services/FindOneRequest';
import { FindServicesRequest } from 'src/proto_build/booking/services/FindServicesRequest';
import { ServiceTime } from 'src/proto_build/booking/services/ServiceTime';
import {UpdateServiceRequest} from 'src/proto_build/booking/services/UpdateServiceRequest';

export class IServiceTime implements ServiceTime {
    @IsNotEmpty()
    @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'startTime must be a valid time in the format HH:mm (24-hour format)',
    })
    @ApiProperty()
    startTime: string;

    @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'endTime must be a valid time in the format HH:mm (24-hour format)',
    })
    @IsNotEmpty()
    @ApiProperty()
    endTime: string;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    @ApiProperty()
    duration: number;

    @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'breakStart must be a valid time in the format HH:mm (24-hour format)',
    })
    @IsNotEmpty()
    @ApiProperty()
    breakStart: string;

    @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'breakEnd must be a valid time in the format HH:mm (24-hour format)',
    })
    @IsNotEmpty()
    @ApiProperty()
    breakEnd: string;
}

export class CreateService implements CreateServiceRequest {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsPositive()
    @IsNotEmpty()
    @ApiProperty()
    price: number;

    @IsObject()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => IServiceTime)
    @ApiProperty({ type: IServiceTime })
    timeService: IServiceTime;

    @IsArray()
    @IsNotEmpty()
    @IsBase64DataURI({ each: true, message: 'Each image must be a valid Base64 data URI.' })
    @ApiProperty()
    images: string[];
}

export class CreateServiceRequestDTO extends CreateService {
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

export class FindServices implements FindServicesRequest {
    @IsPositive()
    @Type(() => Number)
    @IsOptional()
    @ApiProperty()
    priceLower: number;

    @IsPositive()
    @Type(() => Number)
    @IsOptional()
    @ApiProperty()
    priceHigher: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string;
}

export class FindServicesRequestDTO extends FindServices {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class DeleteService implements DeleteServiceRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class DeleteServiceRequestDTO extends DeleteService {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class UpdateService implements UpdateServiceRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsPositive()
    @IsNotEmpty()
    @ApiProperty()
    price: number;

    @IsObject()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => IServiceTime)
    @ApiProperty({ type: IServiceTime })
    timeService: IServiceTime;

    @IsArray()
    @IsNotEmpty()
    @IsBase64DataURI({ each: true, message: 'Each image must be a valid Base64 data URI.' })
    @ApiProperty()
    images: string[];
}

export class UpdateServiceRequestDTO extends UpdateService {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
