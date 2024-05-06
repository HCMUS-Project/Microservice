import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsString,
    Min,
    ValidateNested,
} from 'class-validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { CartItem } from 'src/proto_build/e_commerce/cart/CartItem';
import { CreateCartRequest } from 'src/proto_build/e_commerce/cart/CreateCartRequest';
import { DeleteCartRequest } from 'src/proto_build/e_commerce/cart/DeleteCartRequest';
import { FindAllCartsByUserIdRequest } from 'src/proto_build/e_commerce/cart/FindAllCartsByUserIdRequest';
import { FindCartByIdRequest } from 'src/proto_build/e_commerce/cart/FindCartByIdRequest';
import { UpdateCartRequest } from 'src/proto_build/e_commerce/cart/UpdateCartRequest';

export class CartItemDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    productId: string;

    @IsNumber()
    @Min(1)
    @ApiProperty()
    quantity: number;
}

export class CreateCart implements CreateCartRequest {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;

    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    @ApiProperty({ type: [CartItemDto] })
    cartItems: CartItemDto[];
}

export class CreateCartRequestDTO extends CreateCart {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindAllCartsByUserIdRequestDTO implements FindAllCartsByUserIdRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;
}

export class FindCartByIdRequestDTO implements FindCartByIdRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;
}

export class UpdateCart implements UpdateCartRequest {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    @ApiProperty({ type: [CartItemDto] })
    cartItems: CartItemDto[];
}

export class UpdateCartRequestDTO extends UpdateCart {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class DeleteCartRequestDTO implements DeleteCartRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}
