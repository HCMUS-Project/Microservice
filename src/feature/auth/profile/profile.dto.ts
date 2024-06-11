import {
    IsEnum,
    IsInt,
    IsJWT,
    IsMobilePhone,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import { UserDto } from '../../commonDTO/user.dto';
import { Gender } from 'src/common/enums/gender.enum';
import { ApiProperty } from '@nestjs/swagger';
import { GetProfileRequest } from 'src/proto_build/auth/profile/GetProfileRequest';
import { UpdateProfileRequest } from 'src/proto_build/auth/profile/UpdateProfileRequest';
import {UpdateTenantProfileRequest} from 'src/proto_build/auth/profile/UpdateTenantProfileRequest';
import {GetTenantProfileRequest} from 'src/proto_build/auth/profile/GetTenantProfileRequest';

export class GetProfileRequestDTO implements GetProfileRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class GetTenantProfileRequestDTO implements GetTenantProfileRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class UpdateProfileDto implements UpdateProfileRequest {
    @IsString()
    @IsOptional()
    @ApiProperty()
    username: string;

    @IsString()
    @IsMobilePhone(
        'vi-VN',
        { strictMode: false },
        { message: 'Must be VietNam Phone Number (84..)' },
    )
    @IsOptional()
    @ApiProperty()
    phone: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    address: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string;

    @IsString()
    @IsEnum(Gender, { message: 'Must be a valid gender: male, female, other' })
    @IsOptional()
    @ApiProperty()
    gender: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    @ApiProperty()
    age: number;
}

export class UpdateProfileRequestDTO extends UpdateProfileDto {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class UpdateTenantProfile implements UpdateTenantProfileRequest {
    @IsString()
    @IsOptional()
    @ApiProperty()
    username: string;

    @IsString()
    @IsMobilePhone(
        'vi-VN',
        { strictMode: false },
        { message: 'Must be VietNam Phone Number (84..)' },
    )
    @IsOptional()
    @ApiProperty()
    phone: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    address: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string;

    @IsString()
    @IsEnum(Gender, { message: 'Must be a valid gender: male, female, other' })
    @IsOptional()
    @ApiProperty()
    gender: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    @ApiProperty()
    age: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    avatar: string;
}

export class UpdateTenantProfileRequestDTO extends UpdateTenantProfile {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
