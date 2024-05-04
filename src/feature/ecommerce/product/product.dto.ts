import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsObject,
    IsString,
    IsNumber,
    IsArray,
    IsInt,
    IsOptional,
} from 'class-validator';
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

export class CreateProductRequestDTO implements CreateProductRequest {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    price: number;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    quantity: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    views: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    rating: number;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({ type: [String] })
    categories: string[];

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({ type: [String] })
    images: string[];
}

export class FindAllProductsRequestDTO implements FindAllProductsRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindProductById implements FindProductByIdRequest {
    @IsString()
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
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    price: number;

    @IsInt()
    @IsOptional()
    @ApiProperty()
    quantity: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    description: string;

    @IsArray()
    @IsOptional()
    @ApiProperty({ type: [String] })
    images: string[];

    @IsInt()
    @IsOptional()
    @ApiProperty()
    views: number;

    @IsArray()
    @IsOptional()
    @ApiProperty({ type: [String] })
    categories: string[];
}

export class UpdateProductRequestDTO extends UpdateProduct {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class DeleteProduct implements DeleteProductRequest {
    @IsString()
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
    @IsOptional()
    @ApiProperty()
    minPrice: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    maxPrice: number;

    @IsInt()
    @IsOptional()
    @ApiProperty()
    rating: number;

    @IsInt()
    @IsOptional()
    @ApiProperty()
    sold: number;
}

export class SearchProductRequestDTO extends SearchProduct {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class IncreaseProductView implements IncreaseProductViewRequest {
    @IsString()
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
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsNumber()
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
