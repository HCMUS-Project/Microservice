import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsObject, IsString} from "class-validator";
import {UserDto} from "src/feature/commonDTO/user.dto";
import {CreateCategoryRequest} from "src/proto-build/category/CreateCategoryRequest";

export class CreateCategoryRequestDTO implements CreateCategoryRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;
}