import { ApiProperty } from '@nestjs/swagger';
import {
    IsDataURI,
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
import { CreateThemeConfigRequest } from 'src/proto_build/tenant/themeConfig/CreateThemeConfigRequest';
import { DeleteThemeConfigRequest } from 'src/proto_build/tenant/themeConfig/DeleteThemeConfigRequest';
import { FindThemeConfigByTenantIdRequest } from 'src/proto_build/tenant/themeConfig/FindThemeConfigByTenantIdRequest';
import { UpdateThemeConfigRequest } from 'src/proto_build/tenant/themeConfig/UpdateThemeConfigRequest';

export class CreateThemeConfig implements CreateThemeConfigRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;

    @IsHexColor()
    @IsNotEmpty()
    @ApiProperty()
    headerColor: string;

    @IsHexColor()
    @IsNotEmpty()
    @ApiProperty()
    headerTextColor: string;

    @IsHexColor()
    @IsNotEmpty()
    @ApiProperty()
    bodyColor: string;

    @IsHexColor()
    @IsNotEmpty()
    @ApiProperty()
    bodyTextColor: string;

    @IsHexColor()
    @IsNotEmpty()
    @ApiProperty()
    footerColor: string;

    @IsHexColor()
    @IsNotEmpty()
    @ApiProperty()
    footerTextColor: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    textFont: string;

    @IsHexColor()
    @IsNotEmpty()
    @ApiProperty()
    buttonColor: string;

    @IsHexColor()
    @IsNotEmpty()
    @ApiProperty()
    buttonTextColor: string;

    @IsPositive()
    @IsNotEmpty()
    @ApiProperty()
    buttonRadius: number;
}

export class CreateThemeConfigRequestDTO extends CreateThemeConfig {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindThemeConfigByTenantId implements FindThemeConfigByTenantIdRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;
}

export class FindThemeConfigByTenantIdRequestDTO extends FindThemeConfigByTenantId {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class UpdateThemeConfig implements UpdateThemeConfigRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;

    @IsHexColor()
    @IsOptional()
    @ApiProperty()
    headerColor: string;

    @IsHexColor()
    @IsOptional()
    @ApiProperty()
    headerTextColor: string;

    @IsHexColor()
    @IsOptional()
    @ApiProperty()
    bodyColor: string;

    @IsHexColor()
    @IsOptional()
    @ApiProperty()
    bodyTextColor: string;

    @IsHexColor()
    @IsOptional()
    @ApiProperty()
    footerColor: string;

    @IsHexColor()
    @IsOptional()
    @ApiProperty()
    footerTextColor: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    textFont: string;

    @IsHexColor()
    @IsOptional()
    @ApiProperty()
    buttonColor: string;

    @IsHexColor()
    @IsOptional()
    @ApiProperty()
    buttonTextColor: string;

    @IsPositive()
    @IsOptional()
    @ApiProperty()
    buttonRadius: number;
}

export class UpdateThemeConfigRequestDTO extends UpdateThemeConfig {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class DeleteThemeConfig implements DeleteThemeConfigRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class DeleteThemeConfigRequestDTO extends DeleteThemeConfig {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
