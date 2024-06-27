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
import {DomainOrTenantId} from 'src/common/validator/is-either-domain-tenantId.validator';
import { IsSpecificUrl } from 'src/common/validator/is-specific-url.validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import {GetAllBookingsOrdersNumbersRequest} from 'src/proto_build/tenant/customers/GetAllBookingsOrdersNumbersRequest'; 
 

export class GetAllBookingsOrdersNumbersRequestDTO implements GetAllBookingsOrdersNumbersRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
 