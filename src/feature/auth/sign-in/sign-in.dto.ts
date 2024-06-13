import { IsEmail, IsEnum, IsFQDN, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { IsStrongPassword } from '../../../common/validator/is-strong-password.validator';
import { ApiProperty } from '@nestjs/swagger';
import { SignInRequest } from 'src/proto_build/auth/signIn/SignInRequest';
import {ChangePasswordRequest} from 'src/proto_build/auth/signIn/ChangePasswordRequest';
import {UserDto} from 'src/feature/commonDTO/user.dto';
import {Role} from 'src/common/enums/role.enum';

// Define a class that implements the SignInRequest interface
export class SignInRequestDTO implements SignInRequest {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsStrongPassword()
    @IsNotEmpty()
    @ApiProperty()
    password: string;

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
        example: Role.ADMIN,
    })
    role: Role;
}

export class ChangePassword implements ChangePasswordRequest{
    @IsStrongPassword()
    @IsNotEmpty()
    @ApiProperty()
    password: string;

    @IsStrongPassword()
    @IsNotEmpty()
    @ApiProperty()
    newPassword: string;
}

export class ChangePasswordRequestDTO extends ChangePassword {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}