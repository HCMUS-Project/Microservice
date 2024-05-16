import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsIn,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsString,
    IsUUID,
    Min,
    ValidateNested,
} from 'class-validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { AddItemsToCartRequest } from 'src/proto_build/e_commerce/cart/AddItemsToCartRequest';
import { CartItem } from 'src/proto_build/e_commerce/cart/CartItem';
import { DeleteCartRequest } from 'src/proto_build/e_commerce/cart/DeleteCartRequest';
import { FindAllCartsByUserIdRequest } from 'src/proto_build/e_commerce/cart/FindAllCartsByUserIdRequest';
import { FindCartByIdRequest } from 'src/proto_build/e_commerce/cart/FindCartByIdRequest';
import { UpdateCartRequest } from 'src/proto_build/e_commerce/cart/UpdateCartRequest';

export class CartItemDto {
    @IsUUID('all')
    @IsNotEmpty()
    @ApiProperty()
    productId: string;

    @IsInt()
    @Min(1)
    @ApiProperty()
    quantity: number;
}

export class AddItemsToCart implements AddItemsToCartRequest {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;

    @IsObject()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    @ApiProperty({ type: CartItemDto })
    cartItem: CartItemDto;
}

export class AddItemsToCartRequestDTO extends AddItemsToCart {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

// export class FindAllCartsByUserId implements FindAllCartsByUserIdRequest {
//     @IsString()
//     @IsNotEmpty()
//     @Type(() => String)
//     @ApiProperty()
//     userId: string;
// }

export class FindAllCartsByUserIdRequestDTO implements FindAllCartsByUserIdRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
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
    @IsUUID('all')
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsObject()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    @ApiProperty({ type: CartItemDto })
    cartItems: CartItemDto;
}

export class UpdateCartRequestDTO extends UpdateCart {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;

    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
export class DeleteCart implements DeleteCartRequest {
    @IsUUID('all')
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}
export class DeleteCartRequestDTO extends DeleteCart {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
