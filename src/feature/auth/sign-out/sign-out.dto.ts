import { IsEmail, IsFQDN, IsNotEmpty, IsObject } from 'class-validator';
import { SignInRequest } from 'src/proto-build/signIn/SignInRequest';
import { IsStrongPassword } from '../../../common/validator/is-strong-password.validator';
import { ApiProperty } from '@nestjs/swagger';
import { SignOutRequest } from 'src/proto-build/signOut/SignOutRequest';
import { User } from 'src/proto-build/userToken/User';
import { UserDto } from '../dto/user.dto';

// Define a class that implements the SignOutRequest interface
export class SignOutRequestDTO implements SignOutRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
