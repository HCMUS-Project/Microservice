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
} from '@nestjs/common';
import { UserDto } from 'src/feature/commonDTO/user.dto';
import {
    ApiEndpoint,
    ApiErrorResponses,
    ApiParamExamples,
    ApiResponseExample,
} from 'src/common/decorator/swagger.decorator';
import { PaymentURLService } from './paymentURL.service';
import { CreatePaymentUrl, CreatePaymentUrlRequestDTO } from './paymentURL.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import Logger, { LoggerKey } from 'src/core/logger/interfaces/logger.interface';
import { ApiTags } from '@nestjs/swagger';

@Controller('payment/url')
@ApiTags('payment/url')
export class PaymentURLController {
    constructor(
        @Inject('GRPC_PAYMENT_SERVICE_PAYMENT_URL')
        private readonly paymentURLService: PaymentURLService,
        @Inject(LoggerKey) private logger: Logger,
    ) {}

    @Post('create')
    @ApiEndpoint({
        summary: `Find one Policy and Term by TenantID`,
        details: `
## Description
Find a Policy and Term by TenantId within a domain using an access token.
## Requirements
- **Access Token**: Must provide a valid access token.
`,
    })
    @ApiParamExamples([
        {
            name: 'tenantId',
            description: 'ID of Tenant in DB',
            example: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
            required: true,
        },
    ])
    @ApiResponseExample(
        'read',
        'find a Policy and Term by tenantId',
        {
            policyAndTerm: {
                id: '4ce1d0b3-7904-4ead-bcd9-97ceb351116a',
                tenantId: 'd4d98d4c-d2f4-4d91-a6e7-2555715ce144',
                policy: 'policy gi do ',
                term: 'term gi do',
                createdAt: '2024-05-21T18:33:07.638Z',
                updatedAt: '2024-05-21T18:33:07.638Z',
            },
        },
        '/api/tenant/policy/find/d4d98d4c-d2f4-4d91-a6e7-2555715ce144',
    )
    @ApiErrorResponses(
        '/api/tenant/policy/find/:tenantId',
        '/api/tenant/policy/find/d4d98d4c-d2f4-4d91-a6e7-2555715ce144',
        {
            badRequest: {
                summary: 'Validation Error',
                detail: 'tenantId must be a UUID',
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
                {
                    key: 'not_found',
                    summary: 'Policy and term not found',
                    detail: 'Policy and term not found',
                    error: 'Unauthorized',
                },
            ],
            forbidden: [
                {
                    key: 'forbidden_resource',
                    summary: 'Forbidden resource',
                    detail: 'Forbidden resource',
                },
            ],
        },
    )
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
    async getPaymentUrl(@Query() data: any, @Res() reply: FastifyReply) {
        const resultCallback = await this.paymentURLService.callbackVnpay(data);

        reply
            .status(HttpStatus.FOUND)
            .redirect(
                resultCallback.urlRedirect +
                    '/result?message=' +
                    resultCallback.message +
                    '&status=' +
                    resultCallback.status,
            );
        return {
            message: resultCallback.message,
            status: resultCallback.status,
        };
    }
}
