import {
    IsEnum,
    IsInt,
    IsJWT,
    IsMobilePhone,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsString,
    Min,
} from 'class-validator';
import { UserDto } from '../../commonDTO/user.dto';
import { Gender } from 'src/common/enums/gender.enum';
import { ApiProperty } from '@nestjs/swagger';
import { GetProfileRequest } from 'src/proto_build/auth/profile/GetProfileRequest';
import { UpdateProfileRequest } from 'src/proto_build/auth/profile/UpdateProfileRequest';

export class GetProfileRequestDTO implements GetProfileRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class UpdateProfileDto implements UpdateProfileRequest {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    username: string;

    @IsString()
    @IsMobilePhone(
        'vi-VN',
        { strictMode: false },
        { message: 'Must be VietNam Phone Number (84..)' },
    )
    @IsNotEmpty()
    @ApiProperty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    address: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsEnum(Gender, { message: 'Must be a valid gender: male, female, other' })
    @IsNotEmpty()
    @ApiProperty()
    gender: string;

    @IsInt()
    @Min(0)
    @IsNotEmpty()
    @ApiProperty()
    age: number;
}

export class UpdateProfileRequestDTO extends UpdateProfileDto {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
