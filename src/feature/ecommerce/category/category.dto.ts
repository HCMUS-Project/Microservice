import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString, IsUUID, IsUrl } from 'class-validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { CreateCategoryRequest } from 'src/proto_build/e_commerce/category/CreateCategoryRequest';
import { FindAllCategoriesRequest } from 'src/proto_build/e_commerce/category/FindAllCategoriesRequest';
import { FindOneCategoryRequest } from 'src/proto_build/e_commerce/category/FindOneCategoryRequest';
import { RemoveCategoryRequest } from 'src/proto_build/e_commerce/category/RemoveCategoryRequest';
import { UpdateCategoryRequest } from 'src/proto_build/e_commerce/category/UpdateCategoryRequest';

export class CreateCategory implements CreateCategoryRequest {
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
    user: UserDto;
}

export class FindCategory implements FindOneCategoryRequest {
    @IsUUID('all')
    @IsOptional()
    @ApiProperty()
    id: string;

    @IsUrl()
    @IsNotEmpty()
    @ApiProperty()
    domain: string;
}

export class FindOneCategoryRequestDTO extends FindCategory {}

export class FindAllCategoriesRequestDTO implements FindAllCategoriesRequest {
    @IsUrl()
    @IsNotEmpty()
    @ApiProperty()
    domain: string;
}

export class UpdateCategory implements UpdateCategoryRequest {
    @IsUUID('all')
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
    user: UserDto;
}

export class RemoveCategory implements RemoveCategoryRequest {
    @IsUUID('all')
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class RemoveCategoryRequestDTO extends RemoveCategory {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
