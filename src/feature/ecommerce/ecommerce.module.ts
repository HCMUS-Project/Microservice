import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { EcommerceCategoryService } from './category/category.service';
import { CategoryController } from './category/category.controller';
import { EcommerceProductService } from './product/product.service';
import { ProductController } from './product/product.controller';
import { VoucherController } from './voucher/voucher.controller';
import { EcommerceVoucherService } from './voucher/voucher.service';
import { EcommerceCartService } from './cart/cart.service';
import { CartController } from './cart/cart.controller';
import { OrderController } from './order/order.controller';
import { EcommerceOrderService } from './order/order.service';
import { ReviewController } from './review/review.controller';
import { EcommerceReviewService } from './review/review.service';

@Module({
    imports: [ClientsModule],
    controllers: [
        CategoryController,
        ProductController,
        VoucherController,
        CartController,
        OrderController,
        ReviewController,
    ],
    providers: [
        {
            provide: 'GRPC_ECOMMERCE_SERVICE_CATEGORY',
            useClass: EcommerceCategoryService,
        },
        {
            provide: 'GRPC_ECOMMERCE_SERVICE_PRODUCT',
            useClass: EcommerceProductService,
        },
        {
            provide: 'GRPC_ECOMMERCE_SERVICE_VOUCHER',
            useClass: EcommerceVoucherService,
        },
        {
            provide: 'GRPC_ECOMMERCE_SERVICE_CART',
            useClass: EcommerceCartService,
        },
        {
            provide: 'GRPC_ECOMMERCE_SERVICE_ORDER',
            useClass: EcommerceOrderService,
        },
        {
            provide: 'GRPC_ECOMMERCE_SERVICE_REVIEW',
            useClass: EcommerceReviewService,
        },
        {
            provide: 'GRPC_ECOMMERCE_SERVICE',
            useFactory: (configService: ConfigService) => {
                return ClientProxyFactory.create({
                    transport: Transport.GRPC,
                    options: {
                        package: [
                            'ecommerce',
                            'userToken',
                            'category',
                            'cart',
                            'product',
                            'review',
                            'voucher',
                            'order',
                        ],
                        protoPath: join(__dirname, '../../../src/proto/e_commerce/ecommerce.proto'),
                        url: configService.get<string>('ECOMMERCE_SERVICE_URL'),
                        loader: {
                            enums: String,
                            objects: true,
                            arrays: true,
                        },
                    },
                });
            },
            inject: [ConfigService],
        },
    ],
})
export class EcommerceModule {}
