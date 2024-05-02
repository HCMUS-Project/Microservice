import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsEnum,
    IsFQDN,
    IsInt,
    IsMobilePhone,
    IsNotEmpty,
    IsNumber,
    IsString,
    Min,
} from 'class-validator';
import { Gender } from 'src/common/enums/gender.enum';
import { IsStrongPassword } from 'src/common/validator/is-strong-password.validator';
import {SignUpRequest} from 'src/proto_build/auth/signUp/SignUpRequest';

export class SignUpRequestDto implements SignUpRequest {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

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

    @IsStrongPassword()
    @ApiProperty()
    password: string;

    @IsFQDN()
    @IsNotEmpty()
    @ApiProperty()
    domain: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    device: string;
}
