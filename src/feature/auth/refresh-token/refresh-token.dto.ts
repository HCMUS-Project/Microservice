import { IsJWT, IsNotEmpty, IsObject } from 'class-validator';
import { UserDto } from '../../commonDTO/user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { RefreshTokenRequest } from 'src/proto_build/auth/refreshToken/RefreshTokenRequest';

export class RefreshTokenRequestDTO implements RefreshTokenRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;

    @IsJWT()
    @IsNotEmpty()
    @ApiProperty()
    refreshToken: string;
}
