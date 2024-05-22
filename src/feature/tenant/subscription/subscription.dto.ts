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
import {CreateSubscriptionRequest} from 'src/proto_build/tenant/subscription/CreateSubscriptionRequest';
import {DeleteSubscriptionRequest} from 'src/proto_build/tenant/subscription/DeleteSubscriptionRequest';
import {FindSubscriptionByTenantIdRequest} from 'src/proto_build/tenant/subscription/FindSubscriptionByTenantIdRequest';
import {UpdateSubscriptionRequest} from 'src/proto_build/tenant/subscription/UpdateSubscriptionRequest';

export class CreateSubscription implements CreateSubscriptionRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;

    @IsPositive()
    @IsNotEmpty()
    @ApiProperty()
    value: number;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    nextBilling: string
}

export class CreateSubscriptionRequestDTO extends CreateSubscription {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindSubscriptionByTenantId implements FindSubscriptionByTenantIdRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;
}

export class FindSubscriptionByTenantIdRequestDTO extends FindSubscriptionByTenantId {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class UpdateSubscription implements UpdateSubscriptionRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;

    @IsPositive()
    @IsOptional()
    @ApiProperty()
    value: number;

    @IsDateString()
    @IsOptional()
    @ApiProperty()
    nextBilling: string
}

export class UpdateSubscriptionRequestDTO extends UpdateSubscription {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class DeleteSubscription implements DeleteSubscriptionRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class DeleteSubscriptionRequestDTO extends DeleteSubscription {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
