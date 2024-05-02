import { IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../commonDTO/user.dto';
import {SignOutRequest} from 'src/proto_build/auth/signOut/SignOutRequest';

// Define a class that implements the SignOutRequest interface
export class SignOutRequestDTO implements SignOutRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
