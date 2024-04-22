import {IsEmail, IsFQDN, IsNotEmpty, IsString} from "class-validator";
import {SignUpRequest} from "src/proto-build/signUp/SignUpRequest";

export class SignUpRequestDto implements SignUpRequest{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    // @IsStrongPassword()
    password: string;

    @IsFQDN()
    @IsNotEmpty()
    domain: string; 

    @IsString()
    @IsNotEmpty()
    device: string;
}