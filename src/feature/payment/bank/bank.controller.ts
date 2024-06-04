import { Body, Controller, Delete, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';
import { PaymentBankService } from './bank.service';
import { ListBankResquest } from 'src/proto_build/payment/bank/ListBankResquest';

@Controller('payment/bank')
@ApiTags('payment/bank')
export class BankController {
    constructor(
        @Inject('GRPC_PAYMENT_SERVICE_BANK')
        private readonly paymentBankService: PaymentBankService,
    ) {}

    @Get('find')
    @ApiEndpoint({
        summary: `Find Banks available for payment`,
        details: `
## Description
Find Banks available for payment within a domain using an access token.
## Requirements
- **Access Token**: Must provide a valid access token.
`,
    })
    @ApiResponseExample(
        'read',
        'find a Policy and Term by tenantId',
        {
            banks: [
                {
                    name: 'Ngân hàng VietcomBank',
                    code: 'VIETCOMBANK',
                },
                {
                    name: 'Ngân hàng Vietinbank',
                    code: 'VIETINBANK',
                },
                {
                    name: 'Ngân hàng BIDV',
                    code: 'BIDV',
                },
                {
                    name: 'Ngân hàng Agribank',
                    code: 'AGRIBANK',
                },
                {
                    name: 'Ngân hàng SacomBank',
                    code: 'SACOMBANK',
                },
                {
                    name: 'Ngân hàng MBBank',
                    code: 'MBBANK',
                },
                {
                    name: 'Ngân hàng Techcombank',
                    code: 'TECHCOMBANK',
                },
                {
                    name: 'Ngân hàng ACB',
                    code: 'ACB',
                },
                {
                    name: 'Ngân hàng VPBank',
                    code: 'VPBANK',
                },
                {
                    name: 'Ngân hàng Đông Á',
                    code: 'DONGABANK',
                },
                {
                    name: 'Ngân hàng SHB',
                    code: 'SHB',
                },
                {
                    name: 'Ngân hàng EximBank',
                    code: 'EXIMBANK',
                },
                {
                    name: 'Ngân hàng EximBank - OMNI',
                    code: 'EXIMBANKOMNI',
                },
                {
                    name: 'Ngân hàng HSBC',
                    code: 'HSBC',
                },
                {
                    name: 'Ngân hàng TPBank',
                    code: 'TPBANK',
                },
                {
                    name: 'Ngân hàng NCB',
                    code: 'NCB',
                },
                {
                    name: 'Ngân hàng OceanBank',
                    code: 'OJB',
                },
                {
                    name: 'Ngân hàng MSBANK',
                    code: 'MSBANK',
                },
                {
                    name: 'Ngân hàng HDBank',
                    code: 'HDBANK',
                },
                {
                    name: 'Ngân hàng NamABank',
                    code: 'NAMABANK',
                },
                {
                    name: 'Ngân hàng OCB',
                    code: 'OCB',
                },
                {
                    name: 'Thẻ quốc tế VISA',
                    code: 'VISA',
                },
                {
                    name: 'Thẻ quốc tế MASTERCARD',
                    code: 'MASTERCARD',
                },
                {
                    name: 'Ví điện tử VNPAY',
                    code: 'VNMART',
                },
                {
                    name: 'Ví điện tử VNPAY',
                    code: 'VNPAYEWALLET',
                },
                {
                    name: 'Thẻ quốc tế JCB',
                    code: 'JCB',
                },
                {
                    name: 'Ngân hàng SCB',
                    code: 'SCB',
                },
                {
                    name: 'Ngân hàng IVB',
                    code: 'IVB',
                },
                {
                    name: 'Ngân hàng TMCP An Bình',
                    code: 'ABBANK',
                },
                {
                    name: 'Ngân hàng VIB',
                    code: 'VIB',
                },
                {
                    name: 'Ví điện tử VINID',
                    code: 'VINID',
                },
                {
                    name: 'Ví điện tử Vimass',
                    code: 'VIMASS',
                },
                {
                    name: 'Ví điện tử VCBPAY',
                    code: 'VCBPAY',
                },
                {
                    name: 'Ngân hàng Seabank',
                    code: 'SEABANK',
                },
                {
                    name: 'Ngân hàng VietBank',
                    code: 'VIETBANK',
                },
                {
                    name: 'Ngân hàng Bản Việt',
                    code: 'VIETCAPITALBANK',
                },
                {
                    name: 'Ví điện tử FOXPAY',
                    code: 'FOXPAY',
                },
                {
                    name: 'Ví điện tử YOLO',
                    code: 'YOLO',
                },
                {
                    name: 'Ví điện tử VNPTPAY',
                    code: 'VNPTPAY',
                },
                {
                    name: 'Ngân hàng BIDC',
                    code: 'BIDC',
                },
                {
                    name: 'Ví điện tử CAKEPAY',
                    code: 'CAKEPAY',
                },
                {
                    name: 'Mobile Banking App',
                    code: 'MBAPP',
                },
                {
                    name: 'Ngân hàng VietABank',
                    code: 'VIETABANK',
                },
                {
                    name: 'Ví điện tử VIVIET',
                    code: 'VIVIET',
                },
                {
                    name: 'Ngân hàng LAOVIETBANK',
                    code: 'LAOVIETBANK',
                },
                {
                    name: 'Ngân hàng BacABank',
                    code: 'BACABANK',
                },
                {
                    name: 'Ngân hàng SAIGONBANK',
                    code: 'SAIGONBANK',
                },
                {
                    name: 'Ngân hàng PVComBank',
                    code: 'PVCOMBANK',
                },
                {
                    name: 'Ngân hàng Wooribank',
                    code: 'WOORIBANK',
                },
                {
                    name: 'Thẻ quốc tế UnionPay',
                    code: 'UPI',
                },
                {
                    name: 'Thẻ quốc tế AMEX',
                    code: 'AMEX',
                },
                {
                    name: 'Ngân hàng Kiên Long',
                    code: 'KIENLONGBANK',
                },
                {
                    name: 'Ngân hàng TMCP Bưu Điện Liên Việt',
                    code: 'LIENVIETBANK',
                },
                {
                    name: 'Ngân hàng TMCP Bảo Việt',
                    code: 'BAOVIETBANK',
                },
                {
                    name: 'Ngân hàng TMCP Thịnh vượng và Phát triển (PGBank)',
                    code: 'PGBANK',
                },
                {
                    name: 'Ngân hàng Dầu khí toàn cầu GP Bank',
                    code: 'GPBANK',
                },
                {
                    name: 'Ngân hàng THNN MTV United Overseas Bank (Viet Nam)',
                    code: 'UOB',
                },
                {
                    name: 'Ngân hàng liên doanh Việt - Nga',
                    code: 'VRB',
                },
                {
                    name: 'Ngân hàng VID PUBLIC',
                    code: 'VIDBANK',
                },
                {
                    name: 'Ngân hàng Shinhan',
                    code: 'SHINHANBANK',
                },
                {
                    name: 'Ngân hàng Chính sách xã hội',
                    code: 'VBSP',
                },
                {
                    name: 'Ngân hàng hợp tác CoopBank',
                    code: 'COOPBANK',
                },
                {
                    name: 'Công ty Tài chính cổ phần Tín Việt',
                    code: 'VIETCREDIT',
                },
                {
                    name: 'Công ty Tài chính TNHH MTV Mirae Asset (Việt Nam)',
                    code: 'MAFC',
                },
                {
                    name: 'Ví điện tử PayME',
                    code: 'PAYME',
                },
                {
                    name: 'Ví điện tử Ting',
                    code: 'VITING',
                },
                {
                    name: 'Ví điện tử Payoo',
                    code: 'PAYOO',
                },
                {
                    name: 'Ví điện tử Viettel Money',
                    code: 'VIETTELPAY',
                },
                {
                    name: 'Ví điện tử VTCPAY',
                    code: 'VTCPAY',
                },
                {
                    name: 'Ngân hàng Xây Dựng',
                    code: 'CBBANK',
                },
                {
                    name: 'TIMOBVB',
                    code: 'TIMOBVB',
                },
            ],
        },
        '/api/payment/bank/find',
    )
    async findBank(@Req() req: Request, @Param() data: ListBankResquest) {
        return await this.paymentBankService.getBank({
            ...data,
        } as ListBankResquest);
    }
}
