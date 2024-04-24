import { IsEmail, IsEnum, IsFQDN, IsJWT, IsNotEmpty } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';
import { Role__Output } from 'src/proto-build/userToken/Role';
import { User } from 'src/proto-build/userToken/User';

export class UserDto implements User {
    @IsEmail()
    @IsNotEmpty()
    'email': string;

    @IsFQDN()
    @IsNotEmpty()
    'domain': string;

    @IsEnum(Role)
    @IsNotEmpty()
    'role': Role__Output;

    @IsJWT()
    @IsNotEmpty()
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
