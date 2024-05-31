import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    IsUppercase,
    IsUrl,
    Matches,
    Max,
    Min,
} from 'class-validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { CreateReviewRequest } from 'src/proto_build/booking/review/CreateReviewRequest';
import { DeleteReviewRequest } from 'src/proto_build/booking/review/DeleteReviewRequest';
import { FindAllReviewsRequest } from 'src/proto_build/booking/review/FindAllReviewsRequest';
import { UpdateReviewRequest } from 'src/proto_build/booking/review/UpdateReviewRequest';
export class CreateReview implements CreateReviewRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    serviceId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    review: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    rating: number;
}

export class CreateReviewRequestDTO extends CreateReview {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class UpdateReview implements UpdateReviewRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    review: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    rating: number;
}

export class UpdateReviewRequestDTO extends UpdateReview {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
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

export class FindAllReviewsRequestDTO implements FindAllReviewsRequest {
    @IsUUID()
    @IsOptional()
    @ApiProperty()
    serviceId: string;

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

    @IsUrl()
    @IsNotEmpty()
    @ApiProperty()
    domain: string;
}
