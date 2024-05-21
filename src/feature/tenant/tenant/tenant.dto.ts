import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { CreateTenantRequest } from 'src/proto_build/tenant/tenant/CreateTenantRequest';
import {DeleteTenantRequest} from 'src/proto_build/tenant/tenant/DeleteTenantRequest';
import { FindTenantByDomainRequest } from 'src/proto_build/tenant/tenant/FindTenantByDomainRequest';
import { FindTenantByIdRequest } from 'src/proto_build/tenant/tenant/FindTenantByIdRequest';
import { UpdateTenantRequest } from 'src/proto_build/tenant/tenant/UpdateTenantRequest';

export class CreateTenant implements CreateTenantRequest {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;
}

export class CreateTenantRequestDTO extends CreateTenant {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindTenantByDomainRequestDTO implements FindTenantByDomainRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindTenantByIdRequestDTO implements FindTenantByIdRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class UpdateTenant implements UpdateTenantRequest {
    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string;
}

export class UpdateTenantRequestDTO extends UpdateTenant {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class DeleteTenant implements DeleteTenantRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class DeleteTenantRequestDTO extends DeleteTenant {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}