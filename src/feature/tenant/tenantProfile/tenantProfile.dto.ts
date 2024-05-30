import { ApiProperty } from '@nestjs/swagger';
import {
    IsDataURI,
    IsEmail,
    IsMobilePhone,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsPhoneNumber,
    IsString,
    IsUUID,
    IsUrl,
    isURL,
} from 'class-validator';
import { IsBase64DataURI } from 'src/common/validator/is-base-64-dataURI.validator';
import {IsEitherUrlOrBase64DataURI} from 'src/common/validator/is-either-base-64-dataURI-or-URL.validator';
import { IsSpecificUrl } from 'src/common/validator/is-specific-url.validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { CreateTenantProfileRequest } from 'src/proto_build/tenant/tenantProfile/CreateTenantProfileRequest';
import { DeleteTenantProfileRequest } from 'src/proto_build/tenant/tenantProfile/DeleteTenantProfileRequest';
import { FindTenantProfileByTenantIdRequest } from 'src/proto_build/tenant/tenantProfile/FindTenantProfileByTenantIdRequest';
import { UpdateTenantProfileRequest } from 'src/proto_build/tenant/tenantProfile/UpdateTenantProfileRequest';

export class CreateTenantProfile implements CreateTenantProfileRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    serviceName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    address: string;

    @IsMobilePhone(
        'vi-VN',
        { strictMode: false },
        { message: 'Must be VietNam Phone Number (84..)' },
    )
    @IsNotEmpty()
    @ApiProperty()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    @IsBase64DataURI({ each: true, message: 'Each image must be a valid Base64 data URI.' })
    @ApiProperty()
    logo: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsSpecificUrl('facebook')
    @IsNotEmpty()
    @ApiProperty()
    facebookUrl: string;

    @IsSpecificUrl('instagram')
    @IsNotEmpty()
    @ApiProperty()
    instagramUrl: string;

    @IsSpecificUrl('youtube')
    @IsNotEmpty()
    @ApiProperty()
    youtubeUrl: string;
}

export class CreateTenantProfileRequestDTO extends CreateTenantProfile {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindTenantProfileByTenantId implements FindTenantProfileByTenantIdRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;
}

export class FindTenantProfileByTenantIdRequestDTO extends FindTenantProfileByTenantId {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class UpdateTenantProfile implements UpdateTenantProfileRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;

    @IsEmail()
    @IsOptional()
    @ApiProperty()
    email: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    serviceName: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    address: string;

    @IsMobilePhone(
        'vi-VN',
        { strictMode: false },
        { message: 'Must be VietNam Phone Number (84..)' },
    )
    @IsOptional()
    @ApiProperty()
    phoneNumber: string;

    @IsString()
    @IsOptional()
    @IsEitherUrlOrBase64DataURI({each: true, message: 'Each image must be either a valid Base64 data URI or an valid URL.'})IsEitherUrlOrBase64DataURI
    @ApiProperty()
    logo: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    description: string;

    @IsSpecificUrl('facebook')
    @IsOptional()
    @ApiProperty()
    facebookUrl: string;

    @IsSpecificUrl('instagram')
    @IsOptional()
    @ApiProperty()
    instagramUrl: string;

    @IsSpecificUrl('youtube')
    @IsOptional()
    @ApiProperty()
    youtubeUrl: string;
}

export class UpdateTenantProfileRequestDTO extends UpdateTenantProfile {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class DeleteTenantProfile implements DeleteTenantProfileRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class DeleteTenantProfileRequestDTO extends DeleteTenantProfile {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
