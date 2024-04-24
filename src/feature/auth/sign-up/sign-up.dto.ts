import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsFQDN, IsNotEmpty, IsString } from 'class-validator';
import {IsStrongPassword} from 'src/common/validator/is-strong-password.validator';
import { SignUpRequest } from 'src/proto-build/signUp/SignUpRequest';

export class SignUpRequestDto implements SignUpRequest {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

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
