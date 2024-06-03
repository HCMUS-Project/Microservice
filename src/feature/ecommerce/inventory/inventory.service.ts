import { Observable, firstValueFrom, lastValueFrom, take, toArray } from 'rxjs';
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ForbiddenException, UserNotFoundException } from 'src/common/exceptions/exceptions';
import { CreateCategoryRequestDTO } from '../category/category.dto';
import { CreateProductRequest } from 'src/proto_build/e_commerce/product/CreateProductRequest';
import { ProductResponse } from 'src/proto_build/e_commerce/product/ProductResponse';
import {
    AddProductQuantityRequestDTO,
    DeleteInventoryFormRequestDTO,
    FindAllInventoryFormRequestDTO,
    UpdateInventoryFormRequestDTO,
} from './inventory.dto';
import { AddProductQuantityResponse } from 'src/proto_build/e_commerce/inventory/AddProductQuantityResponse';
import { FindAllInventoryFormResponse } from 'src/proto_build/e_commerce/inventory/FindAllInventoryFormResponse';
import { UpdateInventoryFormResponse } from 'src/proto_build/e_commerce/inventory/UpdateInventoryFormResponse';
import { DeleteInventoryFormResponse } from 'src/proto_build/e_commerce/inventory/DeleteInventoryFormResponse';

interface InventoryService {
    addProductQuantity(data: AddProductQuantityRequestDTO): Observable<AddProductQuantityResponse>;
    findAllInventoryForm(
        data: FindAllInventoryFormRequestDTO,
    ): Observable<FindAllInventoryFormResponse>;
    updateInventoryForm(
        data: UpdateInventoryFormRequestDTO,
    ): Observable<UpdateInventoryFormResponse>;
    deleteInventoryForm(
        data: DeleteInventoryFormRequestDTO,
    ): Observable<DeleteInventoryFormResponse>;
}

@Injectable()
export class EcommerceInventoryService implements OnModuleInit {
    private iInventoryService: InventoryService;

    constructor(@Inject('GRPC_ECOMMERCE_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iInventoryService = this.client.getService<InventoryService>('InventoryService');
        // console.log(this.iInventoryService)
    }

    async addProductQuantity(
        data: AddProductQuantityRequestDTO,
    ): Promise<AddProductQuantityResponse> {
        try {
            // console.log(this.iInventoryService.createProduct(data));
            const addProductQuantityResponse: AddProductQuantityResponse = await firstValueFrom(
                this.iInventoryService.addProductQuantity(data),
            );
            return addProductQuantityResponse;
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
            } else if (errorDetails.error == 'PRODUCT_NOT_FOUND') {
                throw new ForbiddenException('Product not found');
            } else if (errorDetails.error == 'PRODUCT_QUANTITY_NOT_ENOUGH') {
                throw new ForbiddenException('Product quantity not enough');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async findAllInventoryForm(
        data: FindAllInventoryFormRequestDTO,
    ): Promise<FindAllInventoryFormResponse> {
        try {
            const findAllInventoryFormResponse: FindAllInventoryFormResponse = await firstValueFrom(
                this.iInventoryService.findAllInventoryForm(data),
            );
            return findAllInventoryFormResponse;
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

    async updateInventoryForm(
        data: UpdateInventoryFormRequestDTO,
    ): Promise<UpdateInventoryFormResponse> {
        try {
            const updateInventoryFormResponse: UpdateInventoryFormResponse = await firstValueFrom(
                this.iInventoryService.updateInventoryForm(data),
            );
            return updateInventoryFormResponse;
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
            } else if (errorDetails.error == 'INVENTORY_FORM_NOT_FOUND') {
                throw new ForbiddenException('Inventory form not found');
            } else if (errorDetails.error == 'PRODUCT_NOT_FOUND') {
                throw new ForbiddenException('Product not found');
            } else if (errorDetails.error == 'PRODUCT_QUANTITY_NOT_ENOUGH') {
                throw new ForbiddenException('Product quantity not enough');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async deleteInventoryForm(data: DeleteInventoryFormRequestDTO): Promise<DeleteInventoryFormResponse> {
        try {
            const deleteInventoryFormResponse: DeleteInventoryFormResponse = await firstValueFrom(
                this.iInventoryService.deleteInventoryForm(data),
            );
            return deleteInventoryFormResponse;
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
            } else if (errorDetails.error == 'INVENTORY_FORM_NOT_FOUND') {
                throw new ForbiddenException('Inventory form not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }
}
