import { IsEnum, IsInt, IsJWT, IsMobilePhone, IsNotEmpty, IsNumber, IsObject, IsString, Min } from 'class-validator';
import { UserDto } from '../dto/user.dto';
import { GetProfileRequest } from 'src/proto-build/profile/GetProfileRequest';
import { UpdateProfileRequest } from 'src/proto-build/profile/UpdateProfileRequest';
import {Gender} from 'src/common/enums/gender.enum';

export class GetProfileRequestDTO implements GetProfileRequest {
    @IsObject()
    @IsNotEmpty()
    user: UserDto;
}

export class UpdateProfileRequestDTO implements UpdateProfileRequest {
    @IsObject()
    @IsNotEmpty()
    user: UserDto;

    @IsString()
    @IsNotEmpty()
    // @ApiProperty()
    username: string;

    @IsString()
    @IsMobilePhone('vi-VN',{strictMode: false} ,{message: 'Must be VietNam Phone Number (84..)'})
    @IsNotEmpty()
    // @ApiProperty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsEnum(Gender, {message: 'Must be a valid gender: male, female, other'})
    @IsNotEmpty()
    gender: string;

    @IsInt()
    @Min(0)
    @IsNotEmpty()
    age: number;
}
