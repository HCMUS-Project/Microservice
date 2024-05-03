import { IsEmail, IsFQDN, IsNotEmpty } from 'class-validator';
import { IsStrongPassword } from '../../../common/validator/is-strong-password.validator';
import { ApiProperty } from '@nestjs/swagger';
import { SignInRequest } from 'src/proto_build/auth/signIn/SignInRequest';

// Define a class that implements the SignInRequest interface
export class SignInRequestDTO implements SignInRequest {
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
}
