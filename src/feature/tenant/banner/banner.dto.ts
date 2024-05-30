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
import {IsEitherUrlOrBase64DataURI} from 'src/common/validator/is-either-base-64-dataURI-or-URL.validator';
import { IsSpecificUrl } from 'src/common/validator/is-specific-url.validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { CreateBannerRequest } from 'src/proto_build/tenant/banner/CreateBannerRequest';
import { DeleteBannerRequest } from 'src/proto_build/tenant/banner/DeleteBannerRequest';
import { FindBannerByTenantIdRequest } from 'src/proto_build/tenant/banner/FindBannerByTenantIdRequest';
import { UpdateBannerRequest } from 'src/proto_build/tenant/banner/UpdateBannerRequest';

export class CreateBanner implements CreateBannerRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsHexColor()
    @IsNotEmpty()
    @ApiProperty()
    textColor: string;

    @IsString()
    @IsNotEmpty()
    @IsBase64DataURI({ each: true, message: 'image must be a valid Base64 data URI.' })
    @ApiProperty()
    image: string;
}

export class CreateBannerRequestDTO extends CreateBanner {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindBannerByTenantId implements FindBannerByTenantIdRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;
}

export class FindBannerByTenantIdRequestDTO extends FindBannerByTenantId {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class UpdateBanner implements UpdateBannerRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    title: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    description: string;

    @IsHexColor()
    @IsOptional()
    @ApiProperty()
    textColor: string;

    @IsString()
    @IsOptional()
    // @IsBase64DataURI({ each: true, message: 'image must be a valid Base64 data URI.' })
    @IsEitherUrlOrBase64DataURI({each: true, message: 'Each image must be either a valid Base64 data URI or an valid URL.'})
    @ApiProperty()
    image: string;
}

export class UpdateBannerRequestDTO extends UpdateBanner {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class DeleteBanner implements DeleteBannerRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;
}

export class DeleteBannerRequestDTO extends DeleteBanner {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
