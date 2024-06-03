import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiAcceptedResponse,
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { RolesGuard } from 'src/common/guards/role/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import {
    ApiBodyExample,
    ApiEndpoint,
    ApiErrorResponses,
    ApiParamExamples,
    ApiQueryExamples,
    ApiResponseExample,
    ApiResponseReadExample,
} from 'src/common/decorator/swagger.decorator';
import { UpdateStatusBooking } from 'src/feature/booking/booking/booking.dto';
import { EcommerceInventoryService } from './inventory.service';
import {
    AddProductQuantity,
    AddProductQuantityRequestDTO,
    DeleteInventoryForm,
    DeleteInventoryFormRequestDTO,
    FindAllInventoryForm,
    FindAllInventoryFormRequestDTO,
    UpdateInventoryForm,
    UpdateInventoryFormRequestDTO,
} from './inventory.dto';
import { AddQuantityType } from 'src/common/enums/productAdditionType.enum';

@Controller('/ecommerce/tenant/inventory')
@ApiTags('ecommerce/tenant/inventory')
export class InventoryController {
    constructor(
        @Inject('GRPC_ECOMMERCE_SERVICE_INVENTORY')
        private readonly ecommerceInventoryService: EcommerceInventoryService,
    ) {}

    @Post('add')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Add Product Quantity`,
        details: `
## Description
Add Product Quantity within a domain using an access token. This operation is restricted to tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
`,
    })
    @ApiBodyExample(AddProductQuantity, {
        description: 'add inventory',
        products: [
            {
                productId: 'a002f028-5cea-4ee7-9d67-b6b3883426df',
                quantity: 4,
            },
            {
                productId: 'b75a79f3-87b5-43e8-9d6e-61877f5239e0',
                quantity: 3,
            },
        ],
        type: 'import',
    })
    @ApiResponseExample(
        'update',
        'add Product Quantity',
        {
            products: [
                {
                    productId: 'a002f028-5cea-4ee7-9d67-b6b3883426df',
                    quantity: 4,
                },
                {
                    productId: 'b75a79f3-87b5-43e8-9d6e-61877f5239e0',
                    quantity: 3,
                },
            ],
            id: 'e0cad51a-b3c3-4f64-ac99-f9e5bba63095',
            description: 'add inventory',
            type: 'import',
            domain: '30shine.com',
        },
        '/api/ecommerce/tenant/inventory/add',
    )
    @ApiErrorResponses(
        '/api/ecommerce/tenant/inventory/add',
        '/api/ecommerce/tenant/inventory/add',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'products.productId should not be empty, products.productId must be a UUID, products.quantity should not be empty, products.quantity must be an integer number, type should not be empty, Must be a valid type: import, export, type must be a string',
            },
            unauthorized: [
                {
                    key: 'token_not_verified',
                    summary: 'Token not verified',
                    detail: 'Unauthorized',
                    error: null,
                },
                {
                    key: 'token_not_found',
                    summary: 'Token not found',
                    detail: 'Access Token not found',
                    error: 'Unauthorized',
                },
                {
                    key: 'unauthorized_role',
                    summary: 'Role not verified',
                    detail: 'Unauthorized Role',
                    error: 'Unauthorized',
                },
            ],
            forbidden: [
                {
                    key: 'forbidden_resource',
                    summary: 'Forbidden resource',
                    detail: 'Forbidden resource',
                },
                {
                    key: 'not_found',
                    summary: 'Product not found',
                    detail: 'Product not found',
                },
                {
                    key: 'not_enough',
                    summary: 'Product quantity not enough',
                    detail: 'Product quantity not enough',
                },
            ],
        },
    )
    async addProductQuantity(@Req() req: Request, @Body() data: AddProductQuantity) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(data);
        return await this.ecommerceInventoryService.addProductQuantity({
            user: userData,
            ...data,
        } as AddProductQuantityRequestDTO);
    }

    @Get('find/all')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Find All Inventory Form`,
        details: `
## Description
Return all Invetory Forms within a domain.  

## Requirement
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level permissions.
- **default**: list all forms
`,
    })
    @ApiQueryExamples([
        {
            name: 'type',
            description: 'type of Inventory Form',
            required: false,
            enum: AddQuantityType,
            example: AddQuantityType.INCREMENT,
            // example: 'workDays=SUNDAY&workDays=FRIDAY',
        },
    ])
    @ApiResponseExample(
        'read',
        'find All Inventory Form by Type',
        {
            inventoryForm: [
                {
                    products: [
                        {
                            productId: 'a002f028-5cea-4ee7-9d67-b6b3883426df',
                            quantity: 4,
                        },
                        {
                            productId: 'b75a79f3-87b5-43e8-9d6e-61877f5239e0',
                            quantity: 3,
                        },
                    ],
                    id: '30515e61-9554-4b12-b0c7-dd2a174fa7eb',
                    description: 'add inventory',
                    domain: '30shine.com',
                    type: 'import',
                },
            ],
        },
        '/api/ecommerce/tenant/inventory/find/all?type=import',
    )
    @ApiErrorResponses(
        '/api/ecommerce/tenant/inventory/find/all',
        '/api/ecommerce/tenant/inventory/find/all?type=import',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'type should not be empty, Must be a valid type: import, export, type must be a string',
            },
        },
    )
    async findAllInventoryForm(@Req() req: Request, @Query() data: FindAllInventoryForm) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(data);
        return await this.ecommerceInventoryService.findAllInventoryForm({
            user: userData,
            ...data,
        } as FindAllInventoryFormRequestDTO);
    }

    @Post('update')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Update inventory form`,
        details: `
## Description
Update inventory booking within a domain using an access token. This operation is restricted to tenant and user accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level.
- 
`,
    })
    @ApiBodyExample(UpdateInventoryForm, {
        description: 'add inventory',
        products: [
            {
                productId: 'a002f028-5cea-4ee7-9d67-b6b3883426df',
                quantity: 20,
            },
        ],
        id: '30515e61-9554-4b12-b0c7-dd2a174fa7eb',
    })
    @ApiResponseExample(
        'update',
        'update Inventory Form',
        {
            products: [
                {
                    productId: 'b75a79f3-87b5-43e8-9d6e-61877f5239e0',
                    quantity: 3,
                },
                {
                    productId: 'a002f028-5cea-4ee7-9d67-b6b3883426df',
                    quantity: 20,
                },
            ],
            id: '30515e61-9554-4b12-b0c7-dd2a174fa7eb',
            description: 'add inventory',
            type: 'import',
            domain: '30shine.com',
        },
        '/api/ecommerce/tenant/inventory/update',
    )
    @ApiErrorResponses(
        '/api/ecommerce/tenant/inventory/update',
        '/api/ecommerce/tenant/inventory/update',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'id should not be empty, id must be a UUID, products.0.productId should not be empty, products.0.productId must be a UUID, products.0.quantity should not be empty, products.0.quantity must be a positive number, products.0.quantity must be an integer number',
            },
            unauthorized: [
                {
                    key: 'token_not_verified',
                    summary: 'Token not verified',
                    detail: 'Unauthorized',
                    error: null,
                },
                {
                    key: 'token_not_found',
                    summary: 'Token not found',
                    detail: 'Access Token not found',
                    error: 'Unauthorized',
                },
                {
                    key: 'unauthorized_role',
                    summary: 'Role not verified',
                    detail: 'Unauthorized Role',
                    error: 'Unauthorized',
                },
            ],
            forbidden: [
                {
                    key: 'forbidden_resource',
                    summary: 'Forbidden resource',
                    detail: 'Forbidden resource',
                },
                {
                    key: 'not_found',
                    summary: 'Product not found',
                    detail: 'Product not found',
                },
                {
                    key: 'inventory_not_enough',
                    summary: 'Inventory form not enough',
                    detail: 'Inventory form not enough',
                },
                {
                    key: 'not_enough',
                    summary: 'Product quantity not enough',
                    detail: 'Product quantity not enough',
                },
            ],
        },
    )
    async updateInventoryForm(
        @Req() req: Request,
        @Body() updateInventoryForm: UpdateInventoryForm,
    ) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceInventoryService.updateInventoryForm({
            user: userData,
            ...updateInventoryForm,
        } as UpdateInventoryFormRequestDTO);
    }

    @Delete('delete/:id')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.TENANT)
    @ApiBearerAuth('JWT-access-token-tenant')
    @ApiEndpoint({
        summary: `Delete one Inventory Form by ID`,
        details: `
## Description
Delete a Inventory Form within a domain using an access token. This operation is restricted to tenant accounts only.
        
## Requirements
- **Access Token**: Must provide a valid tenant access token.
- **Permissions**: Requires tenant-level and permissions.
`,
    })
    @ApiParamExamples([
        {
            name: 'id',
            description: 'ID of Inventory Form in DB',
            example: '30515e61-9554-4b12-b0c7-dd2a174fa7eb',
            required: true,
        },
    ])
    @ApiResponseExample(
        'delete',
        'delete a Inventory Form by Id',
        {
            products: [
                {
                    productId: 'b75a79f3-87b5-43e8-9d6e-61877f5239e0',
                    quantity: 3,
                },
                {
                    productId: 'a002f028-5cea-4ee7-9d67-b6b3883426df',
                    quantity: 20,
                },
            ],
            id: '30515e61-9554-4b12-b0c7-dd2a174fa7eb',
            description: 'add inventory',
            type: 'import',
            domain: '30shine.com',
        },
        '/api/ecommerce/tenant/inventory/delete/30515e61-9554-4b12-b0c7-dd2a174fa7eb',
    )
    @ApiErrorResponses(
        '/api/ecommerce/tenant/inventory/delete/:id',
        '/api/ecommerce/tenant/inventory/delete/30515e61-9554-4b12-b0c7-dd2a174fa7eb',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'id must be a UUID',
            },

            unauthorized: [
                {
                    key: 'token_not_verified',
                    summary: 'Token not verified',
                    detail: 'Unauthorized',
                    error: null,
                },
                {
                    key: 'token_not_found',
                    summary: 'Token not found',
                    detail: 'Access Token not found',
                    error: 'Unauthorized',
                },
                {
                    key: 'unauthorized_role',
                    summary: 'Role not verified',
                    detail: 'Unauthorized Role',
                    error: 'Unauthorized',
                },
            ],
            forbidden: [
                {
                    key: 'forbidden_resource',
                    summary: 'Forbidden resource',
                    detail: 'Forbidden resource',
                },
                {
                    key: 'inventory_not_enough',
                    summary: 'Inventory form not enough',
                    detail: 'Inventory form not enough',
                },
            ],
        },
    )
    async deleteInvetoryForm(@Req() req: Request, @Param() data: DeleteInventoryForm) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.ecommerceInventoryService.deleteInventoryForm({
            user: userData,
            ...data,
        } as DeleteInventoryFormRequestDTO);
    }
}
