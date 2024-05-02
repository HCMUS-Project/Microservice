import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, IsString, IsNumber, IsArray, IsInt } from "class-validator";
import { UserDto } from "src/feature/commonDTO/user.dto"; 
import {CreateProductRequest} from "src/proto_build/e_commerce/product/CreateProductRequest";
import {DeleteProductRequest} from "src/proto_build/e_commerce/product/DeleteProductRequest";
import {FindAllProductsRequest} from "src/proto_build/e_commerce/product/FindAllProductsRequest";
import {FindProductByIdRequest} from "src/proto_build/e_commerce/product/FindProductByIdRequest";
import {ProductResponse} from "src/proto_build/e_commerce/product/ProductResponse";
import {UpdateProductRequest} from "src/proto_build/e_commerce/product/UpdateProductRequest";

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

// export class FindAllProductsRequestDTO implements FindAllProductsRequest {
//     @IsObject()
//     @IsNotEmpty()
//     @ApiProperty()
//     user: UserDto
// }

// export class FindProductById implements FindProductByIdRequest {
//     @IsString()
//     @IsNotEmpty()
//     @ApiProperty()
//     id: string;
// }

// export class FindProductByIdRequestDTO extends FindProductById {
//     @IsObject()
//     @IsNotEmpty()
//     @ApiProperty()
//     user: UserDto
// }

// export class UpdateProduct implements UpdateProductRequest {
//     @IsString()
//     @IsNotEmpty()
//     @ApiProperty()
//     id: string;

//     @IsString()
//     @IsNotEmpty()
//     @ApiProperty()
//     name: string;

//     @IsString()
//     @IsNotEmpty()
//     @ApiProperty()
//     description: string;

//     // Add other properties as per your IUpdateProductRequest interface
// }

// export class UpdateProductRequestDTO extends UpdateProduct {
//     @IsObject()
//     @IsNotEmpty()
//     @ApiProperty()
//     user: UserDto
// }

// export class DeleteProduct implements DeleteProductRequest {
//     @IsString()
//     @IsNotEmpty()
//     @ApiProperty()
//     id: string;
// }

// export class DeleteProductRequestDTO extends DeleteProduct {
//     @IsObject()
//     @IsNotEmpty()
//     @ApiProperty()
//     user: UserDto
// }

// Continue this pattern for the remaining methods in your controller