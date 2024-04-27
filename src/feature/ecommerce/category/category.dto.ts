import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsObject, IsString} from "class-validator";
import {UserDto} from "src/feature/commonDTO/user.dto";
import {CreateCategoryRequest} from "src/proto-build/category/CreateCategoryRequest";
import {FindAllCategoriesRequest} from "src/proto-build/category/FindAllCategoriesRequest";
import {FindOneCategoryRequest} from "src/proto-build/category/FindOneCategoryRequest";
import {RemoveCategoryRequest} from "src/proto-build/category/RemoveCategoryRequest";
import {UpdateCategoryRequest} from "src/proto-build/category/UpdateCategoryRequest";

export class CreateCategory implements CreateCategoryRequest{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;
}

export class CreateCategoryRequestDTO extends CreateCategory {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto
}

export class FindAllCategoriesRequestDTO implements FindAllCategoriesRequest{
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto
}

export class FindOneCategory implements FindOneCategoryRequest{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class FindOneCategoryRequestDTO extends FindOneCategory {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto
}

export class UpdateCategory implements UpdateCategoryRequest{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;
}

export class UpdateCategoryRequestDTO extends UpdateCategory {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto
}
 
export class RemoveCategory implements RemoveCategoryRequest{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class RemoveCategoryRequestDTO extends RemoveCategory {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto
}