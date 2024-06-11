import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsEnum,
    IsFQDN,
    IsInt,
    IsMobilePhone,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import { Gender } from 'src/common/enums/gender.enum';
import {Role} from 'src/common/enums/role.enum';
import { IsStrongPassword } from 'src/common/validator/is-strong-password.validator';
import { SignUpRequest } from 'src/proto_build/auth/signUp/SignUpRequest';

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

    @IsNumber()
    @IsEnum(Role, {
        message: 'Must be a valid type: 0, 1, 2',
    })
    @IsOptional()
    @ApiProperty({
        enum: Role,
        enumName: 'Role Type',
        example: Role.TENANT,
    })
    role: Role;
}
