import { Observable, firstValueFrom } from 'rxjs';
import { CreateCategoryRequestDTO } from './category.dto';
import { CreateCategoryResponse } from 'src/proto-build/category/CreateCategoryResponse';
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ForbiddenException, UserNotFoundException } from 'src/common/exceptions/exceptions';

interface CategoryService {
    create(data: CreateCategoryRequestDTO): Observable<CreateCategoryResponse>;
}

@Injectable()
export class EcommerceCategoryService implements OnModuleInit {
    private iCategoryService: CategoryService;

    constructor(@Inject('GRPC_ECOMMERCE_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iCategoryService = this.client.getService<CategoryService>('CategoryService');
    }

    async create(data: CreateCategoryRequestDTO): Promise<CreateCategoryResponse> {
        try {
            const createCategoryResponse: CreateCategoryResponse = await firstValueFrom(
                this.iCategoryService.create(data),
            );
            return createCategoryResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new ForbiddenException('Unauthorized Role', 'Forbidden');
            } else if (errorDetails.error == 'CATEGORY_ALREADY_EXISTS') {
                throw new ForbiddenException('Category already exists', 'Forbidden');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }
}
