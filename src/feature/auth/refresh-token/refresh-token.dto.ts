import { IsJWT, IsNotEmpty, IsObject } from 'class-validator';
import { RefreshTokenRequest } from 'src/proto-build/refreshToken/RefreshTokenRequest';
import { UserDto } from '../dto/user.dto';

export class RefreshTokenRequestDTO implements RefreshTokenRequest {
    @IsObject()
    @IsNotEmpty()
    user: UserDto;

    @IsJWT()
    @IsNotEmpty()
    refreshToken: string;
}
