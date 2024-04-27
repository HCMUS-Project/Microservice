import {Module} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {ClientProxyFactory, ClientsModule, Transport} from "@nestjs/microservices";
import {join} from "path";
import {EcommerceCategoryService} from "./category/category.service";
import {CategoryController} from "./category/category.controller";

@Module({
    imports: [ClientsModule],
    controllers: [ 
        CategoryController
    ],
    providers: [
        {
            provide: 'GRPC_ECOMMERCE_SERVICE_CATEGORY',
            useClass: EcommerceCategoryService,
        }, 
        {
            provide: 'GRPC_ECOMMERCE_SERVICE',
            useFactory: (configService: ConfigService) => {
                return ClientProxyFactory.create({
                    transport: Transport.GRPC,
                    options: {
                        package: [
                            'main', 
                            'userToken',
                            'category',
                        ], 
                        protoPath: join(__dirname, '../../../src/proto/main.proto'),
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