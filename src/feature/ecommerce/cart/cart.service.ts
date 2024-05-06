import {
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';
import {
    CreateCartRequestDTO,
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
    createCart(data: CreateCartRequestDTO): Observable<CartResponse>;
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

    async createCart(data: CreateCartRequestDTO): Promise<CartResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const createCartResponse: CartResponse = await firstValueFrom(
                this.iCartService.createCart(data),
            );
            return createCartResponse;
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

    async findCartById(data: FindCartByIdRequestDTO): Promise<CartResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const cartResponse: CartResponse = await firstValueFrom(
                this.iCartService.findCartById(data),
            );
            return cartResponse;
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

    async updateCart(data: UpdateCartRequestDTO): Promise<CartResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const cartResponse: CartResponse = await firstValueFrom(
                this.iCartService.updateCart(data),
            );
            return cartResponse;
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

    async deleteCart(data: DeleteCartRequestDTO): Promise<CartResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const cartResponse: CartResponse = await firstValueFrom(
                this.iCartService.deleteCart(data),
            );
            return cartResponse;
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
