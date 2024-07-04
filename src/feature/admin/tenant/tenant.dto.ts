import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsInt,
    IsJWT,
    IsMobilePhone,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    IsUrl,
    Min,
} from 'class-validator';
import { UserDto } from '../../commonDTO/user.dto';
import { Gender } from 'src/common/enums/gender.enum';
import { ApiProperty } from '@nestjs/swagger';
import {GetTenantRequest} from 'src/proto_build/admin/tenant/GetTenantRequest';
import {VerifyRequest} from 'src/proto_build/admin/tenant/VerifyRequest';
import {SetTenantStageRequest} from 'src/proto_build/admin/tenant/SetTenantStageRequest';
import {Type} from 'class-transformer';
import {ToBoolean} from 'src/common/decorator/toBoolean.decorator';
import {SetTenantDomainRequest} from 'src/proto_build/admin/tenant/SetTenantDomainRequest';

export class GetTenant implements GetTenantRequest {
    @IsBoolean()
    @IsOptional()
    @ToBoolean()
    @ApiProperty()
    isActive: boolean;

    @IsBoolean()
    @IsOptional()
    @ToBoolean()
    @ApiProperty()
    isVerified: boolean;

    @IsBoolean()
    @IsOptional()
    @ToBoolean()
    @ApiProperty()
    isRejected: boolean;
}

export class GetTenantRequestDTO extends GetTenant {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class Verify implements VerifyRequest {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    // @IsString()
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    isVerify: boolean;
}

export class VerifyRequestDTO extends Verify {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class SetTenantStage implements SetTenantStageRequest {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    stage: string;
}

export class SetTenantStageRequestDTO extends SetTenantStage {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class SetTenantDomain implements SetTenantDomainRequest {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsUrl()
    @IsNotEmpty()
    @ApiProperty()
    domain: string;
}

export class SetTenantDomainRequestDTO extends SetTenantDomain {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
