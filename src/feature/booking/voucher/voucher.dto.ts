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
import { FindAllVouchersByTenantRequest } from 'src/proto_build/booking/voucher/FindAllVouchersByTenantRequest';
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
    maxDiscount: number;

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
    expireAt: string;

    @IsDateString()
    @IsOptional()
    @ApiProperty()
    startAt: string;
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

    @IsPositive()
    // @IsNotEmpty()
    @IsOptional()
    @ApiProperty()
    minAppValue: number;

    // @IsNotEmpty()
    // @IsPositive()
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    discountPercent: number;

    @IsDateString()
    // @IsNotEmpty()
    @IsOptional()
    @ApiProperty()
    expireAt: string;

    @IsDateString()
    // @IsNotEmpty()
    @IsOptional()
    @ApiProperty()
    startAt: string;
}

export class EditVoucherRequestDTO extends EditVoucher {
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

export class FindAllVouchers implements FindAllVouchersRequest {
    @IsUUID()
    @IsOptional()
    @ApiProperty()
    service: string;
}

export class FindAllVouchersRequestDTO extends FindAllVouchers {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindOneVoucher implements FindOneVoucherRequest {
    @IsUUID()
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

export class FindAllVouchersByTenantRequestDTO implements FindAllVouchersByTenantRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
