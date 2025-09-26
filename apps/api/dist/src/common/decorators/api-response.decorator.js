"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiInternalServerErrorResponse = exports.ApiNotFoundResponse = exports.ApiForbiddenResponse = exports.ApiUnauthorizedResponse = exports.ApiBadRequestResponse = exports.ApiCreatedResponse = exports.ApiSuccessResponse = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ApiSuccessResponse = (model, options) => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Success',
        type: model,
        ...options,
    }));
};
exports.ApiSuccessResponse = ApiSuccessResponse;
const ApiCreatedResponse = (model, options) => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Created',
        type: model,
        ...options,
    }));
};
exports.ApiCreatedResponse = ApiCreatedResponse;
const ApiBadRequestResponse = (description = 'Bad Request') => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
        status: 400,
        description,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 400 },
                message: { type: 'string' },
                error: { type: 'string', example: 'Bad Request' },
            },
        },
    }));
};
exports.ApiBadRequestResponse = ApiBadRequestResponse;
const ApiUnauthorizedResponse = (description = 'Unauthorized') => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
        status: 401,
        description,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 401 },
                message: { type: 'string' },
                error: { type: 'string', example: 'Unauthorized' },
            },
        },
    }));
};
exports.ApiUnauthorizedResponse = ApiUnauthorizedResponse;
const ApiForbiddenResponse = (description = 'Forbidden') => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
        status: 403,
        description,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 403 },
                message: { type: 'string' },
                error: { type: 'string', example: 'Forbidden' },
            },
        },
    }));
};
exports.ApiForbiddenResponse = ApiForbiddenResponse;
const ApiNotFoundResponse = (description = 'Not Found') => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
        status: 404,
        description,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: { type: 'string' },
                error: { type: 'string', example: 'Not Found' },
            },
        },
    }));
};
exports.ApiNotFoundResponse = ApiNotFoundResponse;
const ApiInternalServerErrorResponse = (description = 'Internal Server Error') => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
        status: 500,
        description,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 500 },
                message: { type: 'string' },
                error: { type: 'string', example: 'Internal Server Error' },
            },
        },
    }));
};
exports.ApiInternalServerErrorResponse = ApiInternalServerErrorResponse;
//# sourceMappingURL=api-response.decorator.js.map