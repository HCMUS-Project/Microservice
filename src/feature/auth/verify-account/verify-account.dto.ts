import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsFQDN, IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { SendMailRequest } from 'src/proto_build/auth/verifyAccount/SendMailRequest';
import { VerifyAccountRequest } from 'src/proto_build/auth/verifyAccount/VerifyAccountRequest';

export class VerifyAccountRequestDto implements VerifyAccountRequest {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsFQDN()
    @IsNotEmpty()
    @ApiProperty()
    domain: string;

    @IsNumberString()
    @IsNotEmpty()
    @ApiProperty()
    otp: string;
}

export class SendMailRequestDto implements SendMailRequest {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsFQDN()
    @IsNotEmpty()
    @ApiProperty()
    domain: string;
}
