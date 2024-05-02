import { Observable, firstValueFrom, lastValueFrom, take, toArray } from 'rxjs'; 
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ForbiddenException, UserNotFoundException } from 'src/common/exceptions/exceptions';
import {CreateCategoryRequestDTO} from '../category/category.dto';
import {CreateProductRequest} from 'src/proto_build/e_commerce/product/CreateProductRequest';
import {ProductResponse} from 'src/proto_build/e_commerce/product/ProductResponse';
import {CreateProductRequestDTO} from './product.dto';

interface ProductService {
    createProduct(data: CreateProductRequest): Observable<ProductResponse>;
    // findAllCategories(data: FindAllCategoriesRequestDTO): Observable<FindAllCategoriesResponse>;
    // findOneCategory(data: FindOneCategoryRequestDTO): Observable<FindOneCategoryResponse>;
    // updateCategory(data: UpdateCategoryRequestDTO): Observable<UpdateCategoryResponse>;
    // removeCategory(data: RemoveCategoryRequestDTO): Observable<RemoveCategoryResponse>;
}

@Injectable()
export class EcommerceProductService implements OnModuleInit {
    private iProductService: ProductService;

    constructor(@Inject('GRPC_ECOMMERCE_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iProductService = this.client.getService<ProductService>('ProductService');
    }

    async createProduct(data: CreateProductRequestDTO): Promise<ProductResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const createProductResponse: ProductResponse = await firstValueFrom(
                this.iProductService.createProduct(data),
            );
            return createProductResponse;
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

    // async findAllCategories(data: FindAllCategoriesRequestDTO): Promise<FindAllCategoriesResponse> {
    //     try {
    //         const findAllCategoriesResponse: FindAllCategoriesResponse = await firstValueFrom(
    //             this.iCategoryService.findAllCategories(data),
    //         );
    //         return findAllCategoriesResponse;
    //     } catch (e) {
    //         // console.log(e);
    //         const errorDetails = JSON.parse(e.details);
    //         // console.log(errorDetails);

    //         throw new NotFoundException(errorDetails, 'Not found');
    //     }
    // }

    // async findOneCategory(data: FindOneCategoryRequestDTO): Promise<FindOneCategoryResponse> {
    //     try {
    //         const findOneCategoryResponse: FindOneCategoryResponse = await firstValueFrom(
    //             this.iCategoryService.findOneCategory(data),
    //         );
    //         return findOneCategoryResponse;
    //     } catch (e) {
    //         console.log(e);
    //         const errorDetails = JSON.parse(e.details);
    //         console.log(errorDetails);
    //         if (errorDetails.error == 'CATEGORY_NOT_FOUND') {
    //             throw new UserNotFoundException('Category not found', 'Unauthorized');
    //         } else {
    //             throw new NotFoundException(errorDetails, 'Not found');
    //         }
    //     }
    // }

    // async updateCategory(data: UpdateCategoryRequestDTO): Promise<UpdateCategoryResponse> {
    //     try {
    //         const updateCategoryResponse: UpdateCategoryResponse = await firstValueFrom(
    //             this.iCategoryService.updateCategory(data),
    //         );
    //         return updateCategoryResponse;
    //     } catch (e) {
    //         console.log(e);
    //         const errorDetails = JSON.parse(e.details);
    //         console.log(errorDetails);
    //         if (errorDetails.error == 'CATEGORY_NOT_FOUND') {
    //             throw new UserNotFoundException('Category not found', 'Unauthorized');
    //         } else {
    //             throw new NotFoundException(errorDetails, 'Not found');
    //         }
    //     }
    // }

    // async removeCategory(data: RemoveCategoryRequestDTO): Promise<RemoveCategoryResponse> {
    //     try {
    //         const removeCategoryResponse: RemoveCategoryResponse = await firstValueFrom(
    //             this.iCategoryService.removeCategory(data),
    //         );
    //         return removeCategoryResponse;
    //     } catch (e) {
    //         console.log(e);
    //         const errorDetails = JSON.parse(e.details);
    //         console.log(errorDetails);
    //         if (errorDetails.error == 'CATEGORY_NOT_FOUND') {
    //             throw new UserNotFoundException('Category not found', 'Unauthorized');
    //         } else {
    //             throw new NotFoundException(errorDetails, 'Not found');
    //         }
    //     }
    // }
}
