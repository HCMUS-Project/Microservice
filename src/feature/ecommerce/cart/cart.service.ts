import {
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';
import {
    AddItemsToCartRequestDTO,
    DeleteCartRequestDTO,
    FindAllCartsByUserIdRequestDTO,
    FindCartByIdRequestDTO,
    UpdateCartRequestDTO,
} from './cart.dto';
import { CartResponse } from 'src/proto_build/e_commerce/cart/CartResponse';
import { Observable, firstValueFrom } from 'rxjs';
import { FindAllCartsResponse } from 'src/proto_build/e_commerce/cart/FindAllCartsResponse';
import { ClientGrpc } from '@nestjs/microservices';
import { UserNotFoundException } from 'src/common/exceptions/exceptions';

interface CartService {
    addItemsToCart(data: AddItemsToCartRequestDTO): Observable<CartResponse>;
    findAllCartsByUserId(data: FindAllCartsByUserIdRequestDTO): Observable<FindAllCartsResponse>;
    findCartById(data: FindCartByIdRequestDTO): Observable<CartResponse>;
    updateCart(data: UpdateCartRequestDTO): Observable<CartResponse>;
    deleteCart(data: DeleteCartRequestDTO): Observable<CartResponse>;
}

@Injectable()
export class EcommerceCartService implements OnModuleInit {
    private iCartService: CartService;

    constructor(@Inject('GRPC_ECOMMERCE_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iCartService = this.client.getService<CartService>('CartService');
        // console.log(this.iProductService)
    }

    async addItemsToCart(data: AddItemsToCartRequestDTO): Promise<CartResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const addItemsToCartResponse: CartResponse = await firstValueFrom(
                this.iCartService.addItemsToCart(data),
            );
            return addItemsToCartResponse;
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
            } else if (errorDetails.error == 'PRODUCT_NOT_ENOUGH') {
                throw new ForbiddenException('Product not enough', 'Forbidden');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async findAllCartsByUserId(
        data: FindAllCartsByUserIdRequestDTO,
    ): Promise<FindAllCartsResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const findAllCartsResponse: FindAllCartsResponse = await firstValueFrom(
                this.iCartService.findAllCartsByUserId(data),
            );
            return findAllCartsResponse;
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
            } else if (errorDetails.error == 'CART_NOT_FOUND') {
                throw new ForbiddenException('Cart not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async findCartById(data: FindCartByIdRequestDTO): Promise<CartResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const cartResponse: CartResponse = await firstValueFrom(
                this.iCartService.findCartById(data),
            );
            return cartResponse;
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
            } else if (errorDetails.error == 'CART_NOT_FOUND') {
                throw new ForbiddenException('Cart not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async updateCart(data: UpdateCartRequestDTO): Promise<CartResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            // console.log(data)
            const cartResponse: CartResponse = await firstValueFrom(
                this.iCartService.updateCart(data),
            );
            return cartResponse;
        } catch (e) {
            console.log(e);
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
            } else if (errorDetails.error.includes('PRODUCT_NOT_ENOUGH')) {
                const productName = errorDetails.error.split(': ')[1];
                throw new ForbiddenException(`Product ${productName} not enough`, 'Forbidden');
            } else if (errorDetails.error == 'CART_ITEM_NOT_FOUND') {
                throw new UserNotFoundException(`Cart item not found`);
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async deleteCart(data: DeleteCartRequestDTO): Promise<CartResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const cartResponse: CartResponse = await firstValueFrom(
                this.iCartService.deleteCart(data),
            );
            return cartResponse;
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
            } else if (errorDetails.error == 'CART_NOT_FOUND') {
                throw new ForbiddenException('Cart not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }
}
