import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Inject,
    LoggerService,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import {
    ApiBodyExample,
    ApiEndpoint,
    ApiErrorResponses,
    ApiParamExamples,
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';
import { PaymentURLService } from './paymentURL.service';
import { CreatePaymentUrl, CreatePaymentUrlRequestDTO } from './paymentURL.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import Logger, { LoggerKey } from 'src/core/logger/interfaces/logger.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { RolesGuard } from 'src/common/guards/role/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('payment/url')
@ApiTags('payment/url')
export class PaymentURLController {
    constructor(
        @Inject('GRPC_PAYMENT_SERVICE_PAYMENT_URL')
        private readonly paymentURLService: PaymentURLService,
        @Inject(LoggerKey) private logger: Logger,
    ) {}

    @Post('create')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.USER)
    @ApiBearerAuth('JWT-access-token-user')
    @ApiEndpoint({
        summary: `Create Payment Url for purchase`,
        details: `
## Description
Create Payment Url within a domain using an access token. This operation is restricted to user accounts only.
        
## Requirements
- **Access Token**: Must provide a valid user access token.
- **Permissions**: Requires user-level permissions.
`,
    })
    // console
    @ApiBodyExample(CreatePaymentUrl, {
        amount: 100000,
        description: 'ipsum et',
        orderProductsId: ['123456789'],
        orderBookingId: [],
        paymentMethodId: '1240400b-7674-4cfd-a2b7-2d8a8ed2af61',
        vnpReturnUrl: 'http://localhost:3000/api/payment/url/return?domain=example.com',
    })
    @ApiResponseExample(
        'create',
        'create Payment Url',
        {
            paymentUrl:
                'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=10000000&vnp_Command=pay&vnp_CreateDate=20240604150009&vnp_CurrCode=VND&vnp_IpAddr=1.1.1.1&vnp_Locale=vn&vnp_OrderInfo=ipsum+et&vnp_OrderType=210000&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fpayment%2Furl%2Freturn&vnp_TmnCode=H0OFYK66&vnp_TxnRef=898442-1717488009453&vnp_Version=2.1.0&vnp_SecureHash=a88b639bd0f397032126861940777d26de24c8caf0f279d271ca37c993ac6349137eb4e6a3d20b15b1068b52720e1c4431f33587e43633b75a90f89ec002f18f',
        },
        '/api/payment/url/create',
    )
    @ApiErrorResponses('/api/payment/url/create', '/api/payment/url/create', {
        badRequest: {
            summary: 'Validation Error',
            detail: 'paymentMethodId should not be empty, paymentMethodId must be a string, amount should not be empty, amount must be a number conforming to the specified constraints, orderProductsId should not be empty, orderProductsId must be an array, orderBookingId should not be empty, orderBookingId must be an array, description should not be empty, description must be a string, vnpReturnUrl should not be empty, vnpReturnUrl must be a string',
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
                key: 'order_empty',
                summary: 'Order empty',
                detail: 'Order empty',
            },
            {
                key: 'payment_not_found',
                summary: 'Payment method not found',
                detail: 'Payment method not found',
            },
        ],
    })
    async createPaymentUrlRequest(@Req() req: Request, @Body() data: CreatePaymentUrl) {
        const payloadToken = req['user'];
        // const header = req.headers;
        const userData = {
            email: payloadToken.email,
            domain: payloadToken.domain,
            role: payloadToken.role,
            accessToken: payloadToken.accessToken,
        } as UserDto;
        // console.log(userData, dataCategory)
        return await this.paymentURLService.createPaymentUrl({
            user: userData,
            ...data,
        } as CreatePaymentUrlRequestDTO);
    }

    @Get('return')
    /**
     * Retrieves the payment URL and redirects the user to the corresponding page.
     * @param data - The query parameters containing payment data.
     * @param reply - The Fastify reply object used to send the redirect response.
     * @returns An object containing the payment message and status.
     */
    async getPaymentUrl(@Query() data: any, @Res() reply: FastifyReply) {
        this.logger.debug('getPaymentUrl', { props: { data } });
        const resultCallback = await this.paymentURLService.callbackVnpay(data);
        let addHttpDomain = resultCallback.urlRedirect;
        if (!addHttpDomain.startsWith('http')) {
            addHttpDomain = 'http://' + addHttpDomain;
        }
        if (addHttpDomain[addHttpDomain.length - 1] === '/')
            addHttpDomain = addHttpDomain.slice(0, -1);

        this.logger.debug('getPaymentUrl', {
            props: {
                domain:
                    addHttpDomain +
                    '/result?message=' +
                    resultCallback.message +
                    '&status=' +
                    resultCallback.status,
            },
        });
        try {
            reply.redirect(
                addHttpDomain +
                    '/result?message=' +
                    resultCallback.message +
                    '&status=' +
                    resultCallback.status,
            );
        } catch (error) {
            this.logger.error('getPaymentUrl', {
                props: {
                    error,
                },
            });
        }
    }

    @Get('ipn')
    /**
     * Handles the callback for IPN (Instant Payment Notification) from Vnpay.
     * @param data - The data received from the callback.
     * @param reply - The Fastify reply object used to send the response.
     */
    async callbackIpnVnpay(@Query() data: any, @Res() reply: FastifyReply) {
        this.logger.debug('callbackVnpay', { props: { data } });

        const resultCallback = await this.paymentURLService.callbackVnpay(data, true);
        this.logger.debug('callbackVnpay', { props: { resultCallback } });
        reply.status(HttpStatus.OK).send({
            RspCode: resultCallback.rspCode,
            Message: resultCallback.rspMessage,
        });
    }
}
