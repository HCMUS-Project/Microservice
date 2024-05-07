import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsMobilePhone,
    IsNotEmpty,
    IsNumber,
    IsNumberString,
    IsObject,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested,
} from 'class-validator';
import { StageOrder } from 'src/common/enums/stageOrder.enum';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { CancelOrderRequest } from 'src/proto_build/e_commerce/order/CancelOrderRequest';
import { CreateOrderRequest } from 'src/proto_build/e_commerce/order/CreateOrderRequest';
import { GetOrderRequest } from 'src/proto_build/e_commerce/order/GetOrderRequest';
import { ListOrdersRequest } from 'src/proto_build/e_commerce/order/ListOrdersRequest';
import { UpdateStageOrderRequest } from 'src/proto_build/e_commerce/order/UpdateStageOrderRequest';

export class CreateOrder implements CreateOrderRequest {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    domain: string;

    @IsArray()
    @ArrayNotEmpty()
    @ApiProperty({ type: 'array', items: { type: 'string' } })
    productsId: string[];

    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    @ApiProperty({ type: 'array', items: { type: 'number' } })
    quantities: number[];

    @IsString()
    @IsMobilePhone(
        'vi-VN',
        { strictMode: false },
        { message: 'Must be VietNam Phone Number (+84912345678)' },
    )
    @IsNotEmpty()
    @ApiProperty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    address: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    voucherId: string;
}

export class CreateOrderRequestDTO extends CreateOrder {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class GetOrderRequestDTO implements GetOrderRequest {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    orderId: string;

    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class ListOrders implements ListOrdersRequest {
    @IsString()
    @IsEnum(StageOrder, {
        message: 'Must be a valid stage: pending, shipping, completed, cancelled',
    })
    @IsOptional()
    @ApiProperty({ enum: StageOrder, enumName: 'Stage of Order', example: StageOrder.SHIPPING })
    stage: StageOrder;
}

export class ListOrdersRequestDTO extends ListOrders {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class UpdateStageOrder implements UpdateStageOrderRequest {
    @IsString()
    @IsEnum(StageOrder, {
        message: 'Must be a valid stage: pending, shipping, completed, cancelled',
    })
    @IsOptional()
    @ApiProperty({ enum: StageOrder, enumName: 'Stage of Order', example: StageOrder.SHIPPING })
    stage: StageOrder;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    orderId: string;
}

export class UpdateStageOrderRequestDTO extends UpdateStageOrder {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class CancelOrderRequestDTO implements CancelOrderRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}
