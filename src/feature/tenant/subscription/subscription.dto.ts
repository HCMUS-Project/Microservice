import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsDataURI,
    IsDateString,
    IsEmail,
    IsEnum,
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
    NotEquals,
    isURL,
} from 'class-validator';
import { StageTenant } from 'src/common/enums/stageTenant.enum';
import { BadRequestException } from 'src/common/exceptions/exceptions';
import { IsBase64DataURI } from 'src/common/validator/is-base-64-dataURI.validator';
import { IsSpecificUrl } from 'src/common/validator/is-specific-url.validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { CancelSubscriptionRequest } from 'src/proto_build/tenant/subscription/CancelSubscriptionRequest';
import { CreateSubscriptionRequest } from 'src/proto_build/tenant/subscription/CreateSubscriptionRequest';
import { FindAllSubscriptionByQueryAdminRequest } from 'src/proto_build/tenant/subscription/FindAllSubscriptionByQueryAdminRequest';
import { FindAllSubscriptionByQueryRequest } from 'src/proto_build/tenant/subscription/FindAllSubscriptionByQueryRequest';
import { FindPlansRequest } from 'src/proto_build/tenant/subscription/FindPlansRequest';
import { Stage } from 'src/proto_build/tenant/subscription/Stage';
import { UpdateSubscriptionStageByAdminRequest } from 'src/proto_build/tenant/subscription/UpdateSubscriptionStageByAdminRequest';

// Mapping from StageTenant string values to your protobuf enum numbers
const stageMapping: Record<StageTenant, number> = {
    [StageTenant.PENDING]: 0,
    [StageTenant.SUCCESS]: 1,
    [StageTenant.FAILED]: 2,
    [StageTenant.CANCELLED]: 3,
};

export class CreateSubscription implements CreateSubscriptionRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    planName: string;
}

export class CreateSubscriptionRequestDTO extends CreateSubscription {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindAllSubscriptionByQuery implements FindAllSubscriptionByQueryRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;

    @IsOptional()
    @Transform(({ value }) => {
        const numValue = stageMapping[value as StageTenant];
        if (numValue === undefined) {
            throw new BadRequestException(
                `Invalid stage: ${value}. Must be one of: ${Object.keys(StageTenant).join(', ')}`,
                'Bad request',
            );
        }
        return numValue;
    })
    @ApiProperty({
        enum: StageTenant,
        enumName: 'StageTenant',
        description: 'Stage of the subscription',
        example: StageTenant.SUCCESS,
    })
    stage: Stage;
}

export class FindAllSubscriptionByQueryRequestDTO extends FindAllSubscriptionByQuery {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindAllSubscriptionByQueryAdmin implements FindAllSubscriptionByQueryAdminRequest {
    @IsUrl()
    @IsOptional()
    @ApiProperty()
    domain: string;

    @IsOptional()
    @Transform(({ value }) => {
        const numValue = stageMapping[value as StageTenant];
        if (numValue === undefined) {
            throw new BadRequestException(
                `Invalid stage: ${value}. Must be one of: ${Object.keys(StageTenant).join(', ')}`,
                'Bad request',
            );
        }
        return numValue;
    })
    @ApiProperty({
        enum: StageTenant,
        enumName: 'StageTenant',
        description: 'Stage of the subscription',
        example: StageTenant.SUCCESS,
    })
    stage: Stage;

    @IsString()
    @IsOptional()
    @ApiProperty()
    planName: string;
}

export class FindAllSubscriptionByQueryAdminRequestDTO extends FindAllSubscriptionByQueryAdmin {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class FindPlans implements FindPlansRequest {}

export class FindPlansRequestDTO extends FindPlans {}

export class UpdateSubscriptionStageByAdmin implements UpdateSubscriptionStageByAdminRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    tenantId: string;

    @Transform(({ value }) => {
        const numValue = stageMapping[value as StageTenant];
        if (numValue === undefined) {
            throw new BadRequestException(
                `Invalid stage: ${value}. Must be one of: ${Object.keys(StageTenant).join(', ')}`,
                'Bad request',
            );
        }
        return numValue;
    })
    @IsNotEmpty()
    @ApiProperty({
        enum: StageTenant,
        enumName: 'StageTenant',
        description: 'Stage of the subscription',
        example: StageTenant.SUCCESS,
    })
    stage: Stage;
}

export class UpdateSubscriptionStageByAdminRequestDTO extends UpdateSubscriptionStageByAdmin {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

export class CancelSubscription implements CancelSubscriptionRequest {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class CancelSubscriptionRequestDTO extends CancelSubscription {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
