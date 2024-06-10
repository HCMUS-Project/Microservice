import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    IsUUID,
    IsUrl,
    Min,
} from 'class-validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { CreateReviewRequest } from 'src/proto_build/e_commerce/review/CreateReviewRequest';
import { DeleteReviewRequest } from 'src/proto_build/e_commerce/review/DeleteReviewRequest';
import { FindAllReviewsRequest } from 'src/proto_build/e_commerce/review/FindAllReviewsRequest';
import { UpdateReviewRequest } from 'src/proto_build/e_commerce/review/UpdateReviewRequest';

export class CreateReview implements CreateReviewRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    productId: string;

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    @ApiProperty()
    rating: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    review: string;
}

export class CreateReviewRequestDTO extends CreateReview {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindAllReviewsRequestDTO implements FindAllReviewsRequest {
    @IsUrl()
    @IsNotEmpty()
    @ApiProperty()
    domain: string;

    @IsUUID()
    @IsOptional()
    @ApiProperty()
    productId: string;

    @Type(() => Number) // This decorator will automatically transform the input into a number
    @IsInt()
    @Min(1)
    @IsOptional()
    @ApiProperty()
    pageSize: number;

    @Type(() => Number) // This decorator will automatically transform the input into a number
    @IsInt()
    @Min(1)
    @IsOptional()
    @ApiProperty()
    page: number;
}

export class UpdateReview implements UpdateReviewRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    @ApiProperty()
    rating: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    review: string;
}

export class UpdateReviewRequestDTO extends UpdateReview {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    domain: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    productId: string;
}

export class DeleteReview implements DeleteReviewRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class DeleteReviewRequestDTO extends DeleteReview {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
