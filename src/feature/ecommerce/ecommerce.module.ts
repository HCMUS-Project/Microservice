import {Module} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {ClientProxyFactory, ClientsModule, Transport} from "@nestjs/microservices";
import {join} from "path";
import {EcommerceCategoryService} from "./category/category.service";
import {CategoryController} from "./category/category.controller";
import {EcommerceProductService} from "./product/product.service";
import {ProductController} from "./product/product.controller";

@Module({
    imports: [ClientsModule],
    controllers: [ 
        CategoryController, ProductController
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
                            'order'
                            
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
            inject: [ConfigService]
        },
    ],
})
export class EcommerceModule {}