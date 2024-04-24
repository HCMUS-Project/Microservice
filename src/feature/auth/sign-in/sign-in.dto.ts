import { IsEmail, IsFQDN, IsNotEmpty } from 'class-validator';
import { SignInRequest } from 'src/proto-build/signIn/SignInRequest';
import { IsStrongPassword } from '../../../common/validator/is-strong-password.validator';
import { ApiProperty } from '@nestjs/swagger';

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
