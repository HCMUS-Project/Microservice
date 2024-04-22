import { IsEmail, IsFQDN, IsNotEmpty } from 'class-validator';
import { SignInRequest } from 'src/proto-build/signIn/SignInRequest';
import { IsStrongPassword } from '../../../common/validator/is-strong-password.validator';

// Define a class that implements the SignInRequest interface
export class SignInRequestDTO implements SignInRequest {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    // @IsStrongPassword()
    password: string;

    @IsFQDN()
    @IsNotEmpty()
    domain: string;
}
