import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsFQDN, IsJWT, IsNotEmpty } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';
import { Role__Output } from 'src/proto_build/auth/userToken/Role';
import { User } from 'src/proto_build/auth/userToken/User';

export class UserDto implements User {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    'email': string;

    @IsFQDN()
    @IsNotEmpty()
    @ApiProperty()
    'domain': string;

    @IsEnum(Role)
    @IsNotEmpty()
    @ApiProperty()
    'role': Role;

    @IsJWT()
    @IsNotEmpty()
    @ApiProperty()
    'accessToken': string;

    // constructor(dto: Partial<UserDto>) {
    //     this.email = dto.email;
    //     this.domain = dto.domain;
    //     this.accessToken = dto.accessToken;

    //     // Validate role
    //     if (dto.role !== undefined && !isValidRole(dto.role)) {
    //         throw new Error('Invalid role specified');
    //     }
    //     this.role = dto.role;
    // }
}

function isValidRole(role: any): role is Role__Output {
    return Object.values(Role).includes(role);
}
