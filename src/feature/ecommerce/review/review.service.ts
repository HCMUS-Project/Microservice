import {
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';

import { Observable, firstValueFrom } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { UserNotFoundException } from 'src/common/exceptions/exceptions';
import {
    CreateReviewRequestDTO,
    DeleteReviewRequestDTO,
    FindAllReviewsRequestDTO,
    UpdateReviewRequestDTO,
} from './review.dto';
import { ReviewResponse } from 'src/proto_build/e_commerce/review/ReviewResponse';
import { FindAllReviewsResponse } from 'src/proto_build/e_commerce/review/FindAllReviewsResponse';
import { DeleteReviewResponse } from 'src/proto_build/e_commerce/review/DeleteReviewResponse';

interface ReviewService {
    createReview(data: CreateReviewRequestDTO): Observable<ReviewResponse>;
    findAllReviews(data: FindAllReviewsRequestDTO): Observable<FindAllReviewsResponse>;
    updateReview(data: UpdateReviewRequestDTO): Observable<ReviewResponse>;
    deleteReview(data: DeleteReviewRequestDTO): Observable<DeleteReviewResponse>;
}

@Injectable()
export class EcommerceReviewService implements OnModuleInit {
    private iReviewService: ReviewService;

    constructor(@Inject('GRPC_ECOMMERCE_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iReviewService = this.client.getService<ReviewService>('ReviewService');
        // console.log(this.iReviewService)
    }

    async createReview(data: CreateReviewRequestDTO): Promise<ReviewResponse> {
        try {
            console.log(data);
            const reviewResponse: ReviewResponse = await firstValueFrom(
                this.iReviewService.createReview(data),
            );
            return reviewResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'PRODUCT_ALREADY_EXISTS') {
                throw new ForbiddenException('Product already exists', 'Forbidden');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async findAllReviews(data: FindAllReviewsRequestDTO): Promise<FindAllReviewsResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const findAllReviewsResponse: FindAllReviewsResponse = await firstValueFrom(
                this.iReviewService.findAllReviews(data),
            );
            return findAllReviewsResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'PRODUCT_ALREADY_EXISTS') {
                throw new ForbiddenException('Product already exists', 'Forbidden');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async updateReview(data: UpdateReviewRequestDTO): Promise<ReviewResponse> {
        try {
            // console.log(data);
            const reviewResponse: ReviewResponse = await firstValueFrom(
                this.iReviewService.updateReview(data),
            );
            return reviewResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'PRODUCT_ALREADY_EXISTS') {
                throw new ForbiddenException('Product already exists', 'Forbidden');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async deleteReview(data: DeleteReviewRequestDTO): Promise<DeleteReviewResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const deleteReviewResponse: DeleteReviewResponse = await firstValueFrom(
                this.iReviewService.deleteReview(data),
            );
            return deleteReviewResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'PRODUCT_ALREADY_EXISTS') {
                throw new ForbiddenException('Product already exists', 'Forbidden');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }
}
