import {
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

export class GetTenant implements GetTenantRequest {
    @IsString()
    @IsOptional()
    @ApiProperty()
    type: string;
}

export class GetTenantRequestDTO extends GetTenant {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class Verify implements VerifyRequest {
    @IsUrl()
    @IsNotEmpty()
    @ApiProperty()
    domain: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    isVerify: string;
}

export class VerifyRequestDTO extends Verify {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class SetTenantStage implements SetTenantStageRequest {
    @IsUrl()
    @IsNotEmpty()
    @ApiProperty()
    domain: string;

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