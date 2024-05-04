import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsPositive,
    IsString,
    IsUppercase,
    Matches,
    Max,
    Min,
} from 'class-validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { CheckVoucherByCodeRequest } from 'src/proto_build/e_commerce/voucher/CheckVoucherByCodeRequest';
import { CreateVoucherRequest } from 'src/proto_build/e_commerce/voucher/CreateVoucherRequest';
import { DeleteVoucherRequest } from 'src/proto_build/e_commerce/voucher/DeleteVoucherRequest';
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

    @IsString()
    @IsNotEmpty()
    @IsNotEmpty()
    @ApiProperty()
    expireAt: string;
}

export class CreateVoucherDTO extends CreateVoucher {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindAllVouchersRequestDTO implements FindAllVouchersRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindVoucherById implements FindVoucherByIdRequest {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class FindVoucherByIdRequestDTO extends FindVoucherById {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class UpdateVoucher implements UpdateVoucherRequest {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

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

    @IsString()
    @IsNotEmpty()
    @IsNotEmpty()
    @ApiProperty()
    expireAt: string;
}

export class UpdateVoucherRequestDTO extends UpdateVoucher {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class DeleteVoucher implements DeleteVoucherRequest {
    @IsString()
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

export class FindVoucherByCode implements CheckVoucherByCodeRequest {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    code: string;
}

export class FindVoucherByCodeRequestDTO extends FindVoucherByCode {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
