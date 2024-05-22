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
    CancelOrderRequestDTO,
    CreateOrderRequestDTO,
    GetOrderRequestDTO,
    ListOrdersRequestDTO,
    UpdateStageOrderRequestDTO,
} from './order.dto';
import { CreateOrderResponse } from 'src/proto_build/e_commerce/order/CreateOrderResponse';
import { GetOrderResponse } from 'src/proto_build/e_commerce/order/GetOrderResponse';
import { ListOrdersResponse } from 'src/proto_build/e_commerce/order/ListOrdersResponse';
import { UpdateStageOrderResponse } from 'src/proto_build/e_commerce/order/UpdateStageOrderResponse';
import { CancelOrderResponse } from 'src/proto_build/e_commerce/order/CancelOrderResponse';

interface OrderService {
    createOrder(data: CreateOrderRequestDTO): Observable<CreateOrderResponse>;
    getOrder(data: GetOrderRequestDTO): Observable<GetOrderResponse>;
    listOrders(data: ListOrdersRequestDTO): Observable<ListOrdersResponse>;
    updateStageOrder(data: UpdateStageOrderRequestDTO): Observable<UpdateStageOrderResponse>;
    cancelOrder(data: CancelOrderRequestDTO): Observable<CancelOrderResponse>;
}

@Injectable()
export class EcommerceOrderService implements OnModuleInit {
    private iOrderService: OrderService;

    constructor(@Inject('GRPC_ECOMMERCE_SERVICE') private client: ClientGrpc) {}

    onModuleInit() {
        this.iOrderService = this.client.getService<OrderService>('OrderService');
        // console.log(this.iOrderService)
    }

    async creatOrder(data: CreateOrderRequestDTO): Promise<CreateOrderResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const createOrderResponse: CreateOrderResponse = await firstValueFrom(
                this.iOrderService.createOrder(data),
            );
            return createOrderResponse;
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
            } else if (errorDetails.error == 'PRODUCT_OUT_OF_STOCK') {
                throw new ForbiddenException('Product out of stock', 'Forbidden');
            } else if (errorDetails.error == 'VOUCHER_EXPIRED') {
                throw new ForbiddenException('Voucher expired', 'Forbidden');
            } else if (errorDetails.error == 'VOUCHER_NOT_FOUND') {
                throw new UserNotFoundException('Voucher not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async getOrder(data: GetOrderRequestDTO): Promise<GetOrderResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const getOrderResponse: GetOrderResponse = await firstValueFrom(
                this.iOrderService.getOrder(data),
            );
            return getOrderResponse;
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
            } else if (errorDetails.error == 'ORDER_NOT_FOUND') {
                throw new UserNotFoundException('Order not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async listOrders(data: ListOrdersRequestDTO): Promise<ListOrdersResponse> {
        try {
            // console.log(data);
            const listOrdersResponse: ListOrdersResponse = await firstValueFrom(
                this.iOrderService.listOrders(data),
            );
            return listOrdersResponse;
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

    async updateStageOrder(data: UpdateStageOrderRequestDTO): Promise<UpdateStageOrderResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const updateStageOrderResponse: UpdateStageOrderResponse = await firstValueFrom(
                this.iOrderService.updateStageOrder(data),
            );
            return updateStageOrderResponse;
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
            } else if (errorDetails.error == 'INVALID_ARGUMENT') {
                throw new ForbiddenException('Invalid argument stage', 'Forbidden');
            } else if (errorDetails.error == 'ORDER_NOT_FOUND') {
                throw new UserNotFoundException('Order not found');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }

    async cancelOrder(data: CancelOrderRequestDTO): Promise<CancelOrderResponse> {
        try {
            // console.log(this.iProductService.createProduct(data));
            const cancelOrderResponse: CancelOrderResponse = await firstValueFrom(
                this.iOrderService.cancelOrder(data),
            );
            return cancelOrderResponse;
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
            } else if (errorDetails.error == 'ORDER_NOT_FOUND') {
                throw new UserNotFoundException('Order not found');
            } else if (errorDetails.error == 'ORDER_CANCELLED') {
                throw new ForbiddenException('Order already cancelled', 'Forbidden');
            } else if (errorDetails.error == 'CANNOT_CANCEL_ORDER') {
                throw new ForbiddenException(
                    'Stage Order different pending can not cancelled by User',
                    'Forbidden',
                );
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }
}
