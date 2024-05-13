import { ApiProperty } from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {
    IsNotEmpty,
    IsObject,
    IsString,
    IsNumber,
    IsArray,
    IsInt,
    IsOptional,
    IsPositive,
    IsUUID,
} from 'class-validator';
import {IsBase64DataURI} from 'src/common/validator/is-base-64-dataURI.validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { AddProductQuantityRequest } from 'src/proto_build/e_commerce/product/AddProductQuantityRequest';
import { CreateProductRequest } from 'src/proto_build/e_commerce/product/CreateProductRequest';
import { DeleteProductRequest } from 'src/proto_build/e_commerce/product/DeleteProductRequest';
import { FindAllProductsRequest } from 'src/proto_build/e_commerce/product/FindAllProductsRequest';
import { FindProductByIdRequest } from 'src/proto_build/e_commerce/product/FindProductByIdRequest';
import {
    IncreaseProductViewRequest,
    IncreaseProductViewRequest__Output,
} from 'src/proto_build/e_commerce/product/IncreaseProductViewRequest';
import { ProductResponse } from 'src/proto_build/e_commerce/product/ProductResponse';
import { SearchProductsRequest } from 'src/proto_build/e_commerce/product/SearchProductsRequest';
import { UpdateProductRequest } from 'src/proto_build/e_commerce/product/UpdateProductRequest';

export class CreateProduct implements CreateProductRequest {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsPositive()
    @IsNotEmpty()
    @ApiProperty()
    price: number;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    @ApiProperty()
    quantity: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsArray()
    @IsUUID('all', {each: true})
    @IsNotEmpty()
    @ApiProperty()
    categories: string[];

    @IsArray()
    @IsNotEmpty()
    @IsBase64DataURI({ each: true, message: 'Each image must be a valid Base64 data URI.' })
    @ApiProperty()
    images: string[];
}

export class CreateProductRequestDTO extends CreateProduct {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindAllProductsRequestDTO implements FindAllProductsRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindProductById implements FindProductByIdRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class FindProductByIdRequestDTO extends FindProductById {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class UpdateProduct implements UpdateProductRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string;

    @IsPositive()
    @IsOptional()
    @ApiProperty()
    price: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    @ApiProperty()
    quantity: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    description: string;

    @IsArray()
    @IsUUID('all', {each: true})
    @IsNotEmpty()
    @ApiProperty()
    categories: string[];

    @IsArray()
    @IsNotEmpty()
    @IsBase64DataURI({ each: true, message: 'Each image must be a valid Base64 data URI.' })
    @ApiProperty()
    images: string[];
}

export class UpdateProductRequestDTO extends UpdateProduct {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class DeleteProduct implements DeleteProductRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class DeleteProductRequestDTO extends DeleteProduct {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class SearchProduct implements SearchProductsRequest {
    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    category: string;

    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    @ApiProperty()
    minPrice: number;

    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    @ApiProperty()
    maxPrice: number;

    @IsInt()
    @Type(() => Number)
    @IsOptional()
    @ApiProperty()
    rating: number;
}

export class SearchProductRequestDTO extends SearchProduct {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class IncreaseProductView implements IncreaseProductViewRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class IncreaseProductViewDTO extends IncreaseProductView {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class AddProductQuantity implements AddProductQuantityRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    @ApiProperty()
    quantity: number;
}

export class AddProductQuantityDTO extends AddProductQuantity {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
// Continue this pattern for the remaining methods in your controller
