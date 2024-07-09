import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    IsUppercase,
    IsUrl,
    Matches,
    Max,
    Min,
} from 'class-validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { CheckVoucherByCodeRequest } from 'src/proto_build/e_commerce/voucher/CheckVoucherByCodeRequest';
import { CreateVoucherRequest } from 'src/proto_build/e_commerce/voucher/CreateVoucherRequest';
import { DeleteVoucherRequest } from 'src/proto_build/e_commerce/voucher/DeleteVoucherRequest';
import {FindAllVouchersByTenantRequest} from 'src/proto_build/e_commerce/voucher/FindAllVouchersByTenantRequest';
import { FindAllVouchersRequest } from 'src/proto_build/e_commerce/voucher/FindAllVouchersRequest';
import { FindVoucherByIdRequest } from 'src/proto_build/e_commerce/voucher/FindVoucherByIdRequest';
import { UpdateVoucherRequest } from 'src/proto_build/e_commerce/voucher/UpdateVoucherRequest';

export class CreateVoucher implements CreateVoucherRequest {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    voucherName: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[A-Z0-9]*$/, { message: 'Voucher code must be uppercase and contain no spaces' })
    @ApiProperty()
    voucherCode: string;

    @IsPositive()
    @IsNotEmpty()
    @ApiProperty()
    maxDiscount: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @ApiProperty()
    minAppValue: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Max(1)
    @ApiProperty()
    discountPercent: number;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    expireAt: string;

    @IsDateString()
    @IsOptional()
    @ApiProperty()
    startAt: string;
}

export class CreateVoucherDTO extends CreateVoucher {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindAllVouchersRequestDTO implements FindAllVouchersRequest {
    @IsUrl()
    @IsNotEmpty()
    @ApiProperty()
    domain: string;
}

export class FindVoucher implements FindVoucherByIdRequest {
    @IsUUID()
    @IsOptional()
    @ApiProperty()
    id: string;

    @IsString()
    @IsOptional()
    @Matches(/^[A-Z0-9]*$/, { message: 'Voucher code must be uppercase and contain no spaces' })
    @ApiProperty()
    code: string;

    @IsUrl()
    @IsNotEmpty()
    @ApiProperty()
    domain: string;
}

export class FindVoucherByIdRequestDTO implements FindVoucherByIdRequest {
    @IsUrl()
    @IsNotEmpty()
    @ApiProperty()
    domain: string;

    @IsUUID()
    @IsOptional()
    @ApiProperty()
    id: string;
}

export class FindVoucherByCodeRequestDTO implements CheckVoucherByCodeRequest {
    @IsString()
    @IsOptional()
    @Matches(/^[A-Z0-9]*$/, { message: 'Voucher code must be uppercase and contain no spaces' })
    @ApiProperty()
    code: string;

    @IsUrl()
    @IsNotEmpty()
    @ApiProperty()
    domain: string;
}

export class UpdateVoucher implements UpdateVoucherRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsString()
    // @IsNotEmpty()
    @IsOptional()
    @ApiProperty()
    voucherName: string;

    @IsString()
    // @IsNotEmpty()
    @IsOptional()
    @Matches(/^[A-Z0-9]*$/, { message: 'Voucher code must be uppercase and contain no spaces' })
    @ApiProperty()
    voucherCode: string;

    @IsPositive()
    // @IsNotEmpty()
    @IsOptional()
    @ApiProperty()
    maxDiscount: number;

    @IsNumber()
    // @IsNotEmpty()
    @IsOptional()
    @Min(0)
    @ApiProperty()
    minAppValue: number;

    @IsNumber()
    // @IsNotEmpty()
    @IsOptional()
    @Min(0)
    @Max(1)
    @ApiProperty()
    discountPercent: number;

    @IsDateString()
    @IsOptional()
    @ApiProperty()
    expireAt: string;

    @IsDateString()
    @IsOptional()
    @ApiProperty()
    startAt: string;
}

export class UpdateVoucherRequestDTO extends UpdateVoucher {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class DeleteVoucher implements DeleteVoucherRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class DeleteVoucherRequestDTO extends DeleteVoucher {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindAllVouchersByTenantRequestDTO implements FindAllVouchersByTenantRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}