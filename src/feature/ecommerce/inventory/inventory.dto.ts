import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsObject,
    IsString,
    IsNumber,
    IsArray,
    IsInt,
    IsOptional,
    IsPositive,
    IsUUID,
    IsUrl,
    ArrayMinSize,
    IsEnum,
    ValidateNested,
} from 'class-validator';
import { AddQuantityType } from 'src/common/enums/productAdditionType.enum';
import { IsBase64DataURI } from 'src/common/validator/is-base-64-dataURI.validator';
import { IsEitherUrlOrBase64DataURI } from 'src/common/validator/is-either-base-64-dataURI-or-URL.validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { AddProductQuantityRequest } from 'src/proto_build/e_commerce/inventory/AddProductQuantityRequest';
import {DeleteInventoryFormRequest} from 'src/proto_build/e_commerce/inventory/DeleteInventoryFormRequest';
import { FindAllInventoryFormRequest } from 'src/proto_build/e_commerce/inventory/FindAllInventoryFormRequest';
import { TransactionProduct } from 'src/proto_build/e_commerce/inventory/TransactionProduct';
import {UpdateInventoryFormRequest} from 'src/proto_build/e_commerce/inventory/UpdateInventoryFormRequest';

export class ITransactionProduct implements TransactionProduct {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    productId: string;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    @ApiProperty()
    quantity: number;
}

export class AddProductQuantity implements AddProductQuantityRequest {
    @IsString()
    @IsOptional()
    @ApiProperty()
    description: string = 'Default description';

    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ITransactionProduct)
    @ApiProperty({ type: [ITransactionProduct] })
    products: ITransactionProduct[];

    @IsString()
    @IsEnum(AddQuantityType, {
        message: 'Must be a valid type: import, export',
    })
    @IsNotEmpty()
    @ApiProperty({
        enum: AddQuantityType,
        enumName: 'Add Quantity Type',
        example: AddQuantityType.INCREMENT,
    })
    type: string;
}

export class AddProductQuantityRequestDTO extends AddProductQuantity {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindAllInventoryForm implements FindAllInventoryFormRequest {
    @IsString()
    @IsEnum(AddQuantityType, {
        message: 'Must be a valid type: import, export',
    })
    @IsNotEmpty()
    @ApiProperty({
        enum: AddQuantityType,
        enumName: 'Add Quantity Type',
        example: AddQuantityType.INCREMENT,
    })
    type: string;
}

export class FindAllInventoryFormRequestDTO extends FindAllInventoryForm {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class UpdateInventoryForm implements UpdateInventoryFormRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    description: string = 'Default description';

    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ITransactionProduct)
    @ApiProperty({ type: [ITransactionProduct] })
    products: ITransactionProduct[];
}

export class UpdateInventoryFormRequestDTO extends UpdateInventoryForm {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class DeleteInventoryForm implements DeleteInventoryFormRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class DeleteInventoryFormRequestDTO extends DeleteInventoryForm {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

