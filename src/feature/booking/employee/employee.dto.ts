import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsBase64,
    IsDateString,
    IsEmail,
    IsEnum,
    IsInt,
    IsMobilePhone,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    IsUppercase,
    IsUrl,
    Matches,
    Max,
    Min,
    MinLength,
    ValidateNested,
    isArray,
} from 'class-validator';
import { WorkDays } from 'src/common/enums/workDays.enum';
import { WorkShift } from 'src/common/enums/workShift.enum';
import { IsBase64DataURI } from 'src/common/validator/is-base-64-dataURI.validator';
import {IsEitherUrlOrBase64DataURI} from 'src/common/validator/is-either-base-64-dataURI-or-URL.validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { CreateEmployeeRequest } from 'src/proto_build/booking/employee/CreateEmployeeRequest';
import { DeleteEmployeeRequest } from 'src/proto_build/booking/employee/DeleteEmployeeRequest';
import { FindEmployeeRequest } from 'src/proto_build/booking/employee/FindEmployeeRequest';
import { FindOneEmployeeRequest } from 'src/proto_build/booking/employee/FindOneEmployeeRequest';
import { UpdateEmployeeRequest } from 'src/proto_build/booking/employee/UpdateEmployeeRequest';

export class CreateEmployee implements CreateEmployeeRequest {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsString()
    @IsMobilePhone(
        'vi-VN',
        { strictMode: false },
        { message: 'Must be VietNam Phone Number (+84912345678)' },
    )
    @IsNotEmpty()
    @ApiProperty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    @IsBase64DataURI({ each: true, message: 'image must be a valid Base64 data URI.' })
    @ApiProperty()
    image: string;

    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    @IsEnum(WorkDays, { each: true })
    @ApiProperty({ enum: WorkDays, enumName: 'WorkDay' })
    workDays: WorkDays[];

    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    @IsEnum(WorkShift, { each: true })
    @ApiProperty({ enum: WorkShift, enumName: 'WorkShift' })
    workShift: WorkShift[];

    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    @IsUUID('all', { each: true })
    @ApiProperty()
    services: string[];
}

export class CreateEmployeeRequestDTO extends CreateEmployee {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindOneEmployee implements FindOneEmployeeRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class FindOneEmployeeRequestDTO extends FindOneEmployee {

}

export class FindEmployee implements FindEmployeeRequest {
    @IsString()
    @IsOptional()
    @ApiProperty()
    firstName: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    lastName: string;

    @IsEmail()
    @IsOptional()
    @ApiProperty()
    email: string;

    @IsArray()
    @IsOptional()
    @ArrayMinSize(1)
    @IsEnum(WorkDays, { each: true })
    @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
    @ApiProperty()
    workDays: WorkDays[];

    @IsArray()
    @IsOptional()
    @ArrayMinSize(1)
    @IsEnum(WorkShift, { each: true })
    @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
    @ApiProperty()
    workShift: WorkShift[];

    @IsArray()
    @IsOptional()
    @ArrayMinSize(1)
    @IsUUID('all', { each: true })
    @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
    @ApiProperty()
    services: string[];

    @IsUrl()
    @IsNotEmpty()
    @ApiProperty()
    domain: string;
}

export class FindEmployeeRequestDTO extends FindEmployee {
    @IsObject()
    @IsOptional()
    @ApiProperty()
    user: UserDto;
}

export class UpdateEmployee implements UpdateEmployeeRequest {
    @IsString()
    // @IsNotEmpty()
    @IsOptional()
    @ApiProperty()
    firstName: string;

    @IsString()
    // @IsNotEmpty()
    @IsOptional()
    @ApiProperty()
    lastName: string;

    @IsEmail()
    // @IsNotEmpty()
    @IsOptional()
    @ApiProperty()
    email: string;

    @IsString()
    @IsMobilePhone(
        'vi-VN',
        { strictMode: false },
        { message: 'Must be VietNam Phone Number (+84912345678)' },
    )
    // @IsNotEmpty()
    @IsOptional()
    @ApiProperty()
    phone: string;

    @IsString()
    @IsOptional()
    // @IsBase64DataURI({ each: true, message: 'image must be a valid Base64 data URI.' })
    @IsEitherUrlOrBase64DataURI({each: true, message: 'image must be either a valid Base64 data URI or an valid URL.'})
    @ApiProperty()
    image: string;

    @IsArray()
    // @IsNotEmpty()
    @IsOptional()
    @ArrayMinSize(1)
    @IsEnum(WorkDays, { each: true })
    @ApiProperty()
    workDays: WorkDays[];

    @IsArray()
    // @IsNotEmpty()
    @IsOptional()
    @ArrayMinSize(1)
    @IsEnum(WorkShift, { each: true })
    @ApiProperty()
    workShift: WorkShift[];

    @IsArray()
    // @IsNotEmpty()
    @IsOptional()
    @ArrayMinSize(1)
    @IsUUID('all', { each: true })
    @ApiProperty()
    services: string[];

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class UpdateEmployeeRequestDTO extends UpdateEmployee {
    @IsObject()
    @IsOptional()
    @ApiProperty()
    user: UserDto;
}

export class DeleteEmployee implements DeleteEmployeeRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class DeleteEmployeeRequestDTO extends DeleteEmployee {
    @IsObject()
    @IsOptional()
    @ApiProperty()
    user: UserDto;
}
