import { ApiProperty } from '@nestjs/swagger';
import {
    IsDataURI,
    IsDateString,
    IsEmail,
    IsHexColor,
    IsMobilePhone,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsPhoneNumber,
    IsPositive,
    IsString,
    IsUUID,
    IsUrl,
    isURL,
} from 'class-validator';
import { IsBase64DataURI } from 'src/common/validator/is-base-64-dataURI.validator';
import {DomainOrTenantId} from 'src/common/validator/is-either-domain-tenantId.validator';
import { IsSpecificUrl } from 'src/common/validator/is-specific-url.validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { CreatePolicyAndTermRequest } from 'src/proto_build/tenant/policyAndTerm/CreatePolicyAndTermRequest';
import { DeletePolicyAndTermRequest } from 'src/proto_build/tenant/policyAndTerm/DeletePolicyAndTermRequest';
import { FindPolicyAndTermByTenantIdRequest } from 'src/proto_build/tenant/policyAndTerm/FindPolicyAndTermByTenantIdRequest';
import { UpdatePolicyAndTermRequest } from 'src/proto_build/tenant/policyAndTerm/UpdatePolicyAndTermRequest';

export class CreatePolicyAndTerm implements CreatePolicyAndTermRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    policy: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    term: string;
}

export class CreatePolicyAndTermRequestDTO extends CreatePolicyAndTerm {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindPolicyAndTermByTenantId implements FindPolicyAndTermByTenantIdRequest {
    @IsUrl()
    @IsOptional()
    @ApiProperty()
    domain: string;

    @IsUUID()
    @IsOptional()
    @ApiProperty()
    tenantId: string;

    @DomainOrTenantId({
        message: 'Either domain or tenantId must be provided',
    })
    validateDomainOrTenantId: any; // This is needed to trigger the custom validator
}

export class FindPolicyAndTermByTenantIdRequestDTO extends FindPolicyAndTermByTenantId {
 
}

export class UpdatePolicyAndTerm implements UpdatePolicyAndTermRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    policy: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    term: string;
}

export class UpdatePolicyAndTermRequestDTO extends UpdatePolicyAndTerm {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class DeletePolicyAndTerm implements DeletePolicyAndTermRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class DeletePolicyAndTermRequestDTO extends DeletePolicyAndTerm {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
