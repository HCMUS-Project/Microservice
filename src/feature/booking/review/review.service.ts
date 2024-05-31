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
import {CreateReviewRequestDTO, DeleteReviewRequestDTO, FindAllReviewsRequestDTO, UpdateReviewRequestDTO} from './review.dto';
import {ReviewResponse} from 'src/proto_build/booking/review/ReviewResponse';
import {FindAllReviewsResponse} from 'src/proto_build/booking/review/FindAllReviewsResponse';
import {DeleteReviewResponse} from 'src/proto_build/booking/review/DeleteReviewResponse';

interface ReviewService {
    createReview(data: CreateReviewRequestDTO): Observable<ReviewResponse>;
    findAllReviews(data: FindAllReviewsRequestDTO): Observable<FindAllReviewsResponse>;
    updateReview(data: UpdateReviewRequestDTO): Observable<ReviewResponse>;
    deleteReview(data: DeleteReviewRequestDTO): Observable<DeleteReviewResponse>;
}

@Injectable()
export class BookingReviewService implements OnModuleInit {
    private iReviewService: ReviewService;

    constructor(@Inject('GRPC_ECOMMERCE_BOOKING') private client: ClientGrpc) {}

    onModuleInit() {
        this.iReviewService = this.client.getService<ReviewService>('ReviewService');
        // console.log(this.iReviewService)
    }

    async createReview(data: CreateReviewRequestDTO): Promise<ReviewResponse> {
        try {
            // console.log(data);
            const reviewResponse: ReviewResponse = await firstValueFrom(
                this.iReviewService.createReview(data),
            );
            return reviewResponse;
        } catch (e) {
            // console.log(e)
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'USER_HAS_NOT_PURCHASED_SERVICE') {
                throw new ForbiddenException('User has not purchased Service');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
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
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);
            throw new NotFoundException(
                `Unhandled error type: ${errorDetails.error}`,
                'Error not recognized',
            );
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
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'REVIEW_NOT_FOUND') {
                throw new ForbiddenException('Review not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
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
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'REVIEW_NOT_FOUND') {
                throw new ForbiddenException('Review not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }
}
