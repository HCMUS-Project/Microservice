import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
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
    Min,
    ValidateNested,
} from 'class-validator';
import { DateTypeEnum } from 'src/common/enums/dateType.enum';
import { StageOrder } from 'src/common/enums/stageOrder.enum';
import { OrderTypeValue } from 'src/common/enums/typeOrderValue.enum';
import { BadRequestException } from 'src/common/exceptions/exceptions';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { CancelOrderRequest } from 'src/proto_build/e_commerce/order/CancelOrderRequest';
import { CreateOrderRequest } from 'src/proto_build/e_commerce/order/CreateOrderRequest';
import { GetAllOrderValueRequest } from 'src/proto_build/e_commerce/order/GetAllOrderValueRequest';
import { GetOrderRequest } from 'src/proto_build/e_commerce/order/GetOrderRequest';
import { GetOrderResponse } from 'src/proto_build/e_commerce/order/GetOrderResponse';
import { ListOrdersForTenantRequest } from 'src/proto_build/e_commerce/order/ListOrdersForTenantRequest';
import { ListOrdersRequest } from 'src/proto_build/e_commerce/order/ListOrdersRequest';
import { ListOrdersResponse } from 'src/proto_build/e_commerce/order/ListOrdersResponse';
import {OrderType} from 'src/proto_build/e_commerce/order/OrderType';
import { UpdateStageOrderRequest } from 'src/proto_build/e_commerce/order/UpdateStageOrderRequest';

export class CreateOrder implements CreateOrderRequest {
    @IsArray()
    @IsUUID('all', { each: true })
    @ArrayNotEmpty()
    @ApiProperty({ type: 'array', items: { type: 'string' } })
    productsId: string[];

    @IsArray()
    @ArrayNotEmpty()
    @Min(1, { each: true })
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

    @IsUUID()
    @IsOptional()
    @ApiProperty()
    voucherId: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        description: "Id of the payment method, 'COD' 'VNPAY' is supported",
    })
    paymentMethod: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    paymentCallbackUrl: string;
}

export class CreateOrderRequestDTO extends CreateOrder {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class GetOrder implements GetOrderRequest {
    @IsUUID('all')
    @IsNotEmpty()
    @ApiProperty()
    orderId: string;
}

export class GetOrderRequestDTO extends GetOrder {
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

export class ListOrdersForTenant implements ListOrdersForTenantRequest {
    @IsString()
    @IsEnum(StageOrder, {
        message: 'Must be a valid stage: pending, shipping, completed, cancelled',
    })
    @IsOptional()
    @ApiProperty({ enum: StageOrder, enumName: 'Stage of Order', example: StageOrder.SHIPPING })
    stage: StageOrder;
}

export class ListOrdersForTenantRequestDTO extends ListOrdersForTenant {
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
export class CancelOrder implements CancelOrderRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    noteCancel: string;
}
export class CancelOrderRequestDTO extends CancelOrder {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

const dateTypeMaping: Record<DateTypeEnum, number> = {
    [DateTypeEnum.WEEK]: 0,
    [DateTypeEnum.MONTH]: 1,
    [DateTypeEnum.YEAR]: 2,
};

export class GetAllOrderValue implements GetAllOrderValueRequest {
    @IsNotEmpty()
    @Transform(({ value }) => {
        const numValue = dateTypeMaping[value as DateTypeEnum];
        if (numValue === undefined) {
            throw new BadRequestException(
                `Invalid type: ${value}. Must be one of: ${Object.keys(DateTypeEnum).join(', ')}`,
                'Bad request',
            );
        }
        return numValue;
    })
    @ApiProperty({
        enum: DateTypeEnum,
        enumName: 'DateTypeEnum',
        description: 'DateTypeEnum of the subscription',
        example: DateTypeEnum.WEEK,
    })
    type: OrderType;
}

export class GetAllOrderValueRequestDTO extends GetAllOrderValue {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
