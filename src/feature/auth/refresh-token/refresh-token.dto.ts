import { IsJWT, IsNotEmpty, IsObject } from 'class-validator';
import { RefreshTokenRequest } from 'src/proto-build/refreshToken/RefreshTokenRequest';
import { UserDto } from '../../commonDTO/user.dto';
import { ApiProperty } from '@nestjs/swagger';

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
