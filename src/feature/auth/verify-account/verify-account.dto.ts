import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsFQDN, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import {Role} from 'src/common/enums/role.enum';
import { SendMailRequest } from 'src/proto_build/auth/verifyAccount/SendMailRequest';
import { VerifyAccountRequest } from 'src/proto_build/auth/verifyAccount/VerifyAccountRequest';
import { ForgotPasswordRequest } from 'src/proto_build/auth/verifyAccount/ForgotPasswordRequest';
import {IsStrongPassword} from 'src/common/validator/is-strong-password.validator';

export class VerifyAccountRequestDto implements VerifyAccountRequest {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsFQDN()
    @IsOptional()
    @ApiProperty()
    domain: string;

    @IsNumberString()
    @IsNotEmpty()
    @ApiProperty()
    otp: string;

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

export class SendMailRequestDto implements SendMailRequest {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsFQDN()
    @IsOptional()
    @ApiProperty()
    domain: string;

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

export class ForgotPasswordDto implements ForgotPasswordRequest {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsFQDN()
    @IsOptional()
    @ApiProperty()
    domain: string;

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

    @IsStrongPassword()
    @ApiProperty() 
    newpassword: string;

    @IsNumberString()
    @IsNotEmpty()
    @ApiProperty()
    otp: string;
}