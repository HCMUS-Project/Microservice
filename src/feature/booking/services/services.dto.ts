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

export class IServiceTime implements ServiceTime {
    @IsNotEmpty()
    @IsDateString()
    @ApiProperty()
    startTime: string;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    endTime: string;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    @ApiProperty()
    duration: number;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    breakStart: string;

    @IsDateString()
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
