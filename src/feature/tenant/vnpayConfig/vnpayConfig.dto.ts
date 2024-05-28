import { ApiProperty } from '@nestjs/swagger';
import {
    IsDataURI,
    IsDateString,
    IsEmail,
    IsHexColor,
    IsMobilePhone,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsPhoneNumber,
    IsPositive,
    IsString,
    IsUUID,
    IsUrl,
    isURL,
} from 'class-validator';
import { IsBase64DataURI } from 'src/common/validator/is-base-64-dataURI.validator';
import { IsSpecificUrl } from 'src/common/validator/is-specific-url.validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { CreateVNPayConfigRequest } from 'src/proto_build/tenant/vnpayConfig/CreateVNPayConfigRequest';
import { DeleteVNPayConfigRequest } from 'src/proto_build/tenant/vnpayConfig/DeleteVNPayConfigRequest';
import { GetVNPayConfigByTenantIdRequest } from 'src/proto_build/tenant/vnpayConfig/GetVNPayConfigByTenantIdRequest';
import { UpdateVNPayConfigRequest } from 'src/proto_build/tenant/vnpayConfig/UpdateVNPayConfigRequest';

export class CreateVNPayConfig implements CreateVNPayConfigRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    tmnCode: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    secureSecret: string;

    // @IsUrl({protocols:['https'], require_protocol: true})
    @IsUrl()
    @IsNotEmpty()
    @ApiProperty()
    vnpayHost: string;
}

export class CreateVNPayConfigRequestDTO extends CreateVNPayConfig {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class GetVNPayConfigByTenantIdRequestDTO implements GetVNPayConfigByTenantIdRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;
}

// export class GetVNPayConfigByTenantIdRequestDTO extends GetVNPayConfigByTenantId {
//     @IsObject()
//     @IsNotEmpty()
//     @ApiProperty()
//     user: UserDto;
// }

export class UpdateVNPayConfig implements UpdateVNPayConfigRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    tmnCode: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    secureSecret: string;

    @IsUrl()
    @IsOptional()
    @ApiProperty()
    vnpayHost: string;
}

export class UpdateVNPayConfigRequestDTO extends UpdateVNPayConfig {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class DeleteVNPayConfig implements DeleteVNPayConfigRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class DeleteVNPayConfigRequestDTO extends DeleteVNPayConfig {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
