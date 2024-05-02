import { Observable, firstValueFrom, lastValueFrom, take, toArray } from 'rxjs';
import {
    CreateCategoryRequestDTO,
    FindAllCategoriesRequestDTO,
    FindOneCategoryRequestDTO,
    RemoveCategoryRequestDTO,
    UpdateCategoryRequestDTO,
} from './category.dto';
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ForbiddenException, UserNotFoundException } from 'src/common/exceptions/exceptions';
import {CreateCategoryResponse} from 'src/proto_build/e_commerce/category/CreateCategoryResponse';
import {FindAllCategoriesResponse} from 'src/proto_build/e_commerce/category/FindAllCategoriesResponse';
import {FindOneCategoryResponse} from 'src/proto_build/e_commerce/category/FindOneCategoryResponse';
import {UpdateCategoryResponse} from 'src/proto_build/e_commerce/category/UpdateCategoryResponse';
import {RemoveCategoryResponse} from 'src/proto_build/e_commerce/category/RemoveCategoryResponse';
interface CategoryService {
    createCategory(data: CreateCategoryRequestDTO): Observable<CreateCategoryResponse>;
    findAllCategories(data: FindAllCategoriesRequestDTO): Observable<FindAllCategoriesResponse>;
    findOneCategory(data: FindOneCategoryRequestDTO): Observable<FindOneCategoryResponse>;
    updateCategory(data: UpdateCategoryRequestDTO): Observable<UpdateCategoryResponse>
    removeCategory(data: RemoveCategoryRequestDTO): Observable<RemoveCategoryResponse>
}

@Injectable()
export class EcommerceCategoryService implements OnModuleInit {
    private iCategoryService: CategoryService;

    constructor(@Inject('GRPC_ECOMMERCE_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iCategoryService = this.client.getService<CategoryService>('CategoryService');
    }

    async createCategory(data: CreateCategoryRequestDTO): Promise<CreateCategoryResponse> {
        try {
            console.log(this.iCategoryService.createCategory(data));
            const createCategoryResponse: CreateCategoryResponse = await firstValueFrom(
                this.iCategoryService.createCategory(data),
            );
            return createCategoryResponse;
        } catch (e) {
            // console.log(e)
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'CATEGORY_ALREADY_EXISTS') {
                throw new ForbiddenException('Category already exists', 'Forbidden');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async findAllCategories(data: FindAllCategoriesRequestDTO): Promise<FindAllCategoriesResponse> {
        try {
            const findAllCategoriesResponse: FindAllCategoriesResponse = await firstValueFrom(
                this.iCategoryService.findAllCategories(data),
            );
            return findAllCategoriesResponse;
        } catch (e) {
            // console.log(e);
            const errorDetails = JSON.parse(e.details);
            // console.log(errorDetails);

            throw new NotFoundException(errorDetails, 'Not found');
        }
    }

    async findOneCategory(data: FindOneCategoryRequestDTO): Promise<FindOneCategoryResponse> {
        try {
            const findOneCategoryResponse: FindOneCategoryResponse = await firstValueFrom(
                this.iCategoryService.findOneCategory(data),
            );
            return findOneCategoryResponse;
        } catch (e) {
            console.log(e);
            const errorDetails = JSON.parse(e.details);
            console.log(errorDetails);
            if (errorDetails.error == 'CATEGORY_NOT_FOUND') {
                throw new UserNotFoundException('Category not found', 'Unauthorized');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async updateCategory(data: UpdateCategoryRequestDTO): Promise<UpdateCategoryResponse> {
        try {
            const updateCategoryResponse: UpdateCategoryResponse = await firstValueFrom(
                this.iCategoryService.updateCategory(data),
            );
            return updateCategoryResponse;
        } catch (e) {
            console.log(e);
            const errorDetails = JSON.parse(e.details);
            console.log(errorDetails);
            if (errorDetails.error == 'CATEGORY_NOT_FOUND') {
                throw new UserNotFoundException('Category not found', 'Unauthorized');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }

    async removeCategory(data: RemoveCategoryRequestDTO): Promise<RemoveCategoryResponse> {
        try {
            const removeCategoryResponse: RemoveCategoryResponse = await firstValueFrom(
                this.iCategoryService.removeCategory(data),
            );
            return removeCategoryResponse;
        } catch (e) {
            console.log(e);
            const errorDetails = JSON.parse(e.details);
            console.log(errorDetails);
            if (errorDetails.error == 'CATEGORY_NOT_FOUND') {
                throw new UserNotFoundException('Category not found', 'Unauthorized');
            } else {
                throw new NotFoundException(errorDetails, 'Not found');
            }
        }
    }
}
