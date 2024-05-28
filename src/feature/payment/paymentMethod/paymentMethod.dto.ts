import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
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
import { CreatePaymentMethodRequest } from 'src/proto_build/payment/paymentMethod/CreatePaymentMethodRequest';
import { DeletePaymentMethodRequest } from 'src/proto_build/payment/paymentMethod/DeletePaymentMethodRequest';
import { GetPaymentMethodRequest } from 'src/proto_build/payment/paymentMethod/GetPaymentMethodRequest';
import { ListPaymentMethodRequest } from 'src/proto_build/payment/paymentMethod/ListPaymentMethodRequest';
import { UpdatePaymentMethodRequest } from 'src/proto_build/payment/paymentMethod/UpdatePaymentMethodRequest';

export class CreatePaymentMethod implements CreatePaymentMethodRequest {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    type: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    status: boolean;
}

export class CreatePaymentMethodRequestDTO extends CreatePaymentMethod {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class GetPaymentMethod implements GetPaymentMethodRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class GetPaymentMethodRequestDTO extends GetPaymentMethod {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class UpdatePaymentMethod implements UpdatePaymentMethodRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    type: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    status: boolean;
}

export class UpdatePaymentMethodRequestDTO extends UpdatePaymentMethod {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class DeletePaymentMethod implements DeletePaymentMethodRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class DeletePaymentMethodRequestDTO extends DeletePaymentMethod {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class ListPaymentMethodRequestDTO implements ListPaymentMethodRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
