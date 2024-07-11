import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
import { DateTypeEnum } from 'src/common/enums/dateType.enum';
import { BadRequestException } from 'src/common/exceptions/exceptions';
import { IsBase64DataURI } from 'src/common/validator/is-base-64-dataURI.validator';
import { DomainOrTenantId } from 'src/common/validator/is-either-domain-tenantId.validator';
import { IsSpecificUrl } from 'src/common/validator/is-specific-url.validator';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import { DateType } from 'src/proto_build/tenant/customers/DateType';
import { GetAllBookingsOrdersNumbersRequest } from 'src/proto_build/tenant/customers/GetAllBookingsOrdersNumbersRequest';
import { GetUsersReportByDateRequest } from 'src/proto_build/tenant/customers/GetUsersReportByDateRequest';

export class GetAllBookingsOrdersNumbersRequestDTO implements GetAllBookingsOrdersNumbersRequest {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}

const dateTypeMaping: Record<DateTypeEnum, number> = {
    [DateTypeEnum.WEEK]: 0,
    [DateTypeEnum.MONTH]: 1,
    [DateTypeEnum.YEAR]: 2,
};

export class GetUsersReportByDate implements GetUsersReportByDateRequest {
    @IsNotEmpty()
    @Transform(({ value }) => {
        const numValue = dateTypeMaping[value as DateTypeEnum];
        if (numValue === undefined) {
            throw new BadRequestException(
                `Invalid type: ${value}. Must be one of: ${Object.keys(DateTypeEnum).join(', ')}`,
                'Bad request',
            );
        }
        return numValue;
    })
    @ApiProperty({
        enum: DateTypeEnum,
        enumName: 'DateTypeEnum',
        description: 'DateTypeEnum of the report',
        example: DateTypeEnum.WEEK,
    })
    type: DateType;
}

export class GetUsersReportByDateRequestDTO extends GetUsersReportByDate {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    user: UserDto;
}
