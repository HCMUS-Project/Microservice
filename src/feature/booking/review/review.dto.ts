import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    IsUppercase,
    Matches,
    Max,
    Min,
} from 'class-validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { CreateReviewRequest } from 'src/proto_build/booking/review/CreateReviewRequest';
import {DeleteReviewRequest} from 'src/proto_build/booking/review/DeleteReviewRequest';
import { EditReviewRequest } from 'src/proto_build/booking/review/EditReviewRequest';
import {FindAllReviewsRequest} from 'src/proto_build/booking/review/FindAllReviewsRequest';
import {FindOneReviewRequest} from 'src/proto_build/booking/review/FindOneReviewRequest';

export class CreateReview implements CreateReviewRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    serviceId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    rating: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;
}

export class CreateReviewRequestDTO extends CreateReview {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class EditReview implements EditReviewRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    rating: number;
}

export class EditReviewRequestDTO extends EditReview {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class DeleteReview implements DeleteReviewRequest {
    @IsString()
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
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindOneReview implements FindOneReviewRequest {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class FindOneReviewRequestDTO extends FindOneReview {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
