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
    Matches,
    Max,
    Min,
} from 'class-validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { CreateVoucherRequest } from 'src/proto_build/booking/voucher/CreateVoucherRequest';
import { DeleteVoucherRequest } from 'src/proto_build/booking/voucher/DeleteVoucherRequest';
import { EditVoucherRequest } from 'src/proto_build/booking/voucher/EditVoucherRequest';
import { FindAllVouchersRequest } from 'src/proto_build/booking/voucher/FindAllVouchersRequest';
import { FindOneVoucherRequest } from 'src/proto_build/booking/voucher/FindOneVoucherRequest';

export class CreateVoucher implements CreateVoucherRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    serviceId: string;

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
    maxDiscountValue: number;

    @IsPositive()
    @IsNotEmpty()
    @ApiProperty()
    minAppValue: number;

    @IsNotEmpty()
    @IsPositive()
    @ApiProperty()
    discountPercent: number;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    expiredTime: string;
}

export class CreateVoucherRequestDTO extends CreateVoucher {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class EditVoucher implements EditVoucherRequest {
    @IsUUID()
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
    maxDiscountValue: number;

    @IsPositive()
    @IsNotEmpty()
    @ApiProperty()
    minAppValue: number;

    @IsNotEmpty()
    @IsPositive()
    @ApiProperty()
    discountPercent: number;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    expiredTime: string;
}

export class EditVoucherRequestDTO extends EditVoucher {
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

export class FindAllVouchersRequestDTO implements FindAllVouchersRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindOneVoucher implements FindOneVoucherRequest {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class FindOneVoucherRequestDTO extends FindOneVoucher {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
