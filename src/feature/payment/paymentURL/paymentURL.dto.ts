import { ApiProperty } from '@nestjs/swagger';
import {
    IsAlpha,
    IsArray,
    IsBoolean,
    IsDataURI,
    IsDateString,
    IsEmail,
    IsHexColor,
    IsMobilePhone,
    IsNotEmpty,
    IsNumber,
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
import {CreatePaymentUrlRequest} from 'src/proto_build/payment/payment/CreatePaymentUrlRequest';
 
export class CreatePaymentUrl implements CreatePaymentUrlRequest {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    paymentMethodId: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    amount: number;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty()
    orderProductsId: string[];

    @IsArray()
    @IsNotEmpty()
    @ApiProperty()
    orderBookingId: string[];

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    vnpReturnUrl: string;
}

export class CreatePaymentUrlRequestDTO extends CreatePaymentUrl {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}