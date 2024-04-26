import { IsEnum, IsInt, IsJWT, IsMobilePhone, IsNotEmpty, IsNumber, IsObject, IsString, Min } from 'class-validator';
import { UserDto } from '../dto/user.dto';
import { GetProfileRequest } from 'src/proto-build/profile/GetProfileRequest';
import { UpdateProfileRequest } from 'src/proto-build/profile/UpdateProfileRequest';
import {Gender} from 'src/common/enums/gender.enum';
import {ApiProperty} from '@nestjs/swagger';

export class GetProfileRequestDTO implements GetProfileRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class UpdateProfileRequestDTO implements UpdateProfileRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    username: string;

    @IsString()
    @IsMobilePhone('vi-VN',{strictMode: false} ,{message: 'Must be VietNam Phone Number (84..)'})
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
    @IsEnum(Gender, {message: 'Must be a valid gender: male, female, other'})
    @IsNotEmpty()
    @ApiProperty()
    gender: string;

    @IsInt()
    @Min(0)
    @IsNotEmpty()
    @ApiProperty()
    age: number;
}
