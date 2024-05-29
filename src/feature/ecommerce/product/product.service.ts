import { Observable, firstValueFrom, lastValueFrom, take, toArray } from 'rxjs';
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ForbiddenException, UserNotFoundException } from 'src/common/exceptions/exceptions';
import { CreateCategoryRequestDTO } from '../category/category.dto';
import { CreateProductRequest } from 'src/proto_build/e_commerce/product/CreateProductRequest';
import { ProductResponse } from 'src/proto_build/e_commerce/product/ProductResponse';
import {
    AddProductQuantityRequestDTO,
    CreateProductRequestDTO,
    DeleteProductRequestDTO,
    FindAllProductsRequestDTO,
    FindProductByIdRequestDTO,
    IncreaseProductViewDTO,
    SearchProductRequestDTO,
    UpdateProductRequestDTO,
} from './product.dto';
import { FindAllProductsResponse } from 'src/proto_build/e_commerce/product/FindAllProductsResponse';

interface ProductService {
    createProduct(data: CreateProductRequest): Observable<ProductResponse>;
    findAllProducts(data: FindAllProductsRequestDTO): Observable<FindAllProductsResponse>;
    findProductById(data: FindProductByIdRequestDTO): Observable<ProductResponse>;
    updateProduct(data: UpdateProductRequestDTO): Observable<ProductResponse>;
    deleteProduct(data: DeleteProductRequestDTO): Observable<ProductResponse>;
    searchProducts(data: SearchProductRequestDTO): Observable<FindAllProductsResponse>;
    increaseProductView(data: IncreaseProductViewDTO): Observable<ProductResponse>;
    addProductQuantity(data: AddProductQuantityRequestDTO): Observable<ProductResponse>;
}

@Injectable()
export class EcommerceProductService implements OnModuleInit {
    private iProductService: ProductService;

    constructor(@Inject('GRPC_ECOMMERCE_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iProductService = this.client.getService<ProductService>('ProductService');
        // console.log(this.iProductService)
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
            } else if (errorDetails.error == 'PRODUCT_ALREADY_EXISTS') {
                throw new ForbiddenException('Product already exists', 'Forbidden');
            } else if (errorDetails.error == 'CATEGORY_NOT_FOUND') {
                throw new ForbiddenException('Category not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async findAllProducts(data: FindAllProductsRequestDTO): Promise<FindAllProductsResponse> {
        try {
            const findAllProductsResponse: FindAllProductsResponse = await firstValueFrom(
                this.iProductService.findAllProducts(data),
            );
            return findAllProductsResponse;
        } catch (e) {
            // console.log(e);
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

    async findOneProduct(data: FindProductByIdRequestDTO): Promise<ProductResponse> {
        try {
            const productResponse: ProductResponse = await firstValueFrom(
                this.iProductService.findProductById(data),
            );
            return productResponse;
        } catch (e) {
            // console.log(e);
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);
            if (errorDetails.error == 'PRODUCT_NOT_FOUND') {
                throw new ForbiddenException('Product not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async updateProduct(data: UpdateProductRequestDTO): Promise<ProductResponse> {
        try {
            const productResponse: ProductResponse = await firstValueFrom(
                this.iProductService.updateProduct(data),
            );
            return productResponse;
        } catch (e) {
            // console.log(e);
            // console.log(e.response);
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'PRODUCT_NOT_FOUND') {
                throw new ForbiddenException('Product not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async removeProduct(data: DeleteProductRequestDTO): Promise<ProductResponse> {
        try {
            const removeCategoryResponse: ProductResponse = await firstValueFrom(
                this.iProductService.deleteProduct(data),
            );
            return removeCategoryResponse;
        } catch (e) {
            // console.log(e);
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new UserNotFoundException('Unauthorized Role', 'Unauthorized');
            } else if (errorDetails.error == 'PRODUCT_NOT_FOUND') {
                throw new ForbiddenException('Product not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async searchProducts(data: SearchProductRequestDTO): Promise<FindAllProductsResponse> {
        try {
            // console.log(data);
            const findAllProductsResponse: FindAllProductsResponse = await firstValueFrom(
                this.iProductService.searchProducts(data),
            );
            return findAllProductsResponse;
        } catch (e) {
            // console.log(e);
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

    async increaseProductView(data: IncreaseProductViewDTO): Promise<ProductResponse> {
        try {
            const productResponse: ProductResponse = await firstValueFrom(
                this.iProductService.increaseProductView(data),
            );
            return productResponse;
        } catch (e) {
            // console.log(e);
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new NotFoundException(String(e), 'Error not recognized');
            }
            // console.log(errorDetails);
            if (errorDetails.error == 'PRODUCT_NOT_FOUND') {
                throw new ForbiddenException('Product not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async addProductQuantity(data: AddProductQuantityRequestDTO): Promise<ProductResponse> {
        try {
            const productResponse: ProductResponse = await firstValueFrom(
                this.iProductService.addProductQuantity(data),
            );
            return productResponse;
        } catch (e) {
            // console.log(e);
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
}
