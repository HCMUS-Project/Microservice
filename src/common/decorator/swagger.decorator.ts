// src/common/decorators/api.decorator.ts
import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiBody,
    ApiResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiQuery,
    ApiParam,
} from '@nestjs/swagger';

export function ApiEndpoint(description: { summary: string; details?: string }) {
    return applyDecorators(
        ApiOperation({ summary: description.summary, description: description.details }),
    );
}

export function ApiBodyExample(dto: any, example: any) {
    return applyDecorators(
        ApiBody({ type: dto, examples: { default: { summary: 'Example', value: example } } }),
    );
}

export function ApiResponseExample(
    operationType: 'create' | 'read' | 'update' | 'delete',
    nameApi: string,
    example: any,
    path: string,
) {
    const statusCodes = {
        create: ApiCreatedResponse,
        read: ApiOkResponse,
        update: ApiCreatedResponse,
        delete: ApiOkResponse,
    };
    const statusCode = {
        create: 201,
        read: 200,
        update: 201,
        delete: 200,
    };

    const ResponseDecorator = statusCodes[operationType];
    return applyDecorators(
        ResponseDecorator({
            description: `${operationType.charAt(0).toUpperCase() + operationType.slice(1)} successfully.`,
            content: {
                'application/json': {
                    examples: {
                        default: {
                            summary: `Response after ${nameApi} successfully`,
                            value: {
                                statusCode: statusCode[operationType],
                                timestamp: new Date().toISOString(),
                                path: path,
                                message: null,
                                error: null,
                                data: example,
                            },
                        },
                    },
                },
            },
        }),
    );
}

function createErrorResponseDecorator(statusCode: number, description: string, examples: any) {
    const decorators = {
        400: ApiBadRequestResponse,
        401: ApiUnauthorizedResponse,
        403: ApiForbiddenResponse,
    };

    return decorators[statusCode]({
        description,
        content: {
            'application/json': { examples },
        },
    });
}

export function ApiErrorResponses(
    path_badRequest: string,
    path: string,
    messages: {
        badRequest?: { summary: string; detail: string };
        unauthorized?: Array<{ key: string; summary: string; detail: string; error: string }>;
        forbidden?: Array<{ key: string; summary: string; detail: string }>;
    },
) {
    const decorators = [];
    const timestamp = new Date().toISOString();

    if (messages.badRequest) {
        decorators.push(
            createErrorResponseDecorator(400, 'Validation failed', {
                default: {
                    summary: messages.badRequest.summary,
                    value: {
                        statusCode: 400,
                        timestamp: timestamp,
                        path: path_badRequest,
                        message: messages.badRequest.detail,
                        error: 'Bad Request',
                        data: null,
                    },
                },
            }),
        );
    }

    if (messages.unauthorized && messages.unauthorized.length) {
        const unauthorizedExamples = {};
        messages.unauthorized.forEach(ex => {
            unauthorizedExamples[ex.key] = {
                summary: ex.summary,
                value: {
                    statusCode: 401,
                    timestamp: timestamp,
                    path: path,
                    message: ex.detail,
                    error: ex.error,
                    data: null,
                },
            };
        });
        decorators.push(
            createErrorResponseDecorator(401, 'Authorization failed', unauthorizedExamples),
        );
    }

    if (messages.forbidden && messages.forbidden.length) {
        const forbiddenExamples = {};
        messages.forbidden.forEach(ex => {
            forbiddenExamples[ex.key] = {
                summary: ex.summary,
                value: {
                    statusCode: 403,
                    timestamp: timestamp,
                    path: path,
                    message: ex.detail,
                    error: 'Forbidden',
                    data: null,
                },
            };
        });
        decorators.push(
            createErrorResponseDecorator(
                403,
                'Access to the resource is forbidden',
                forbiddenExamples,
            ),
        );
    }

    return applyDecorators(...decorators);
}

export function ApiQueryExamples(
    queries: Array<{ name: string; description: string; example: any; required?: boolean }>,
) {
    return applyDecorators(
        ...queries.map(query =>
            ApiQuery({
                name: query.name,
                description: query.description,
                example: query.example,
                required: query.required !== undefined ? query.required : true,
            }),
        ),
    );
}

export function ApiParamExamples(
    params: Array<{ name: string; description: string; example: any; required?: boolean }>,
) {
    return applyDecorators(
        ...params.map(query =>
            ApiParam({
                name: query.name,
                description: query.description,
                example: query.example,
                required: query.required !== undefined ? query.required : true,
            }),
        ),
    );
}
