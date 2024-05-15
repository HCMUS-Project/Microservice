import {
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { UserNotFoundException } from 'src/common/exceptions/exceptions';
import { Observable, firstValueFrom } from 'rxjs';
import {
    CreateReviewRequestDTO,
    DeleteReviewRequestDTO,
    EditReviewRequestDTO,
    FindAllReviewsRequestDTO,
    FindOneReviewRequestDTO,
} from './review.dto';
import { CreateReviewResponse } from 'src/proto_build/booking/review/CreateReviewResponse';
import { EditReviewResponse } from 'src/proto_build/booking/review/EditReviewResponse';
import { DeleteReviewResponse } from 'src/proto_build/booking/review/DeleteReviewResponse';
import { FindAllReviewsResponse } from 'src/proto_build/booking/review/FindAllReviewsResponse';
import { FindOneReviewResponse } from 'src/proto_build/booking/review/FindOneReviewResponse';

interface ReviewService {
    createReview(data: CreateReviewRequestDTO): Observable<CreateReviewResponse>;
    editReview(data: EditReviewRequestDTO): Observable<EditReviewResponse>;
    deleteReview(data: DeleteReviewRequestDTO): Observable<DeleteReviewResponse>;
    findAllReviews(data: FindAllReviewsRequestDTO): Observable<FindAllReviewsResponse>;
    findOneReview(data: FindOneReviewRequestDTO): Observable<FindOneReviewResponse>;
}

@Injectable()
export class BookingReviewService implements OnModuleInit {
    private iReviewService: ReviewService;

    constructor(@Inject('GRPC_ECOMMERCE_BOOKING') private client: ClientGrpc) {}

    onModuleInit() {
        this.iReviewService = this.client.getService<ReviewService>('ReviewService');
        // console.log(this.iProductService)
    }

    async createReview(data: CreateReviewRequestDTO): Promise<CreateReviewResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const createReviewResponse: CreateReviewResponse = await firstValueFrom(
                this.iReviewService.createReview(data),
            );
            return createReviewResponse;
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

    async editReview(data: EditReviewRequestDTO): Promise<EditReviewResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const editReviewResponse: EditReviewResponse = await firstValueFrom(
                this.iReviewService.editReview(data),
            );
            return editReviewResponse;
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

    async findOneReview(data: FindOneReviewRequestDTO): Promise<FindOneReviewResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const findOneReviewResponse: FindOneReviewResponse = await firstValueFrom(
                this.iReviewService.findOneReview(data),
            );
            return findOneReviewResponse;
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
