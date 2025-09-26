import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

export const ApiSuccessResponse = <TModel extends Type<any>>(
  model?: TModel,
  options?: Omit<ApiResponseOptions, 'type'>,
) => {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Success',
      type: model,
      ...options,
    }),
  );
};

export const ApiCreatedResponse = <TModel extends Type<any>>(
  model?: TModel,
  options?: Omit<ApiResponseOptions, 'type'>,
) => {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'Created',
      type: model,
      ...options,
    }),
  );
};

export const ApiBadRequestResponse = (description = 'Bad Request') => {
  return applyDecorators(
    ApiResponse({
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
    }),
  );
};

export const ApiUnauthorizedResponse = (description = 'Unauthorized') => {
  return applyDecorators(
    ApiResponse({
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
    }),
  );
};

export const ApiForbiddenResponse = (description = 'Forbidden') => {
  return applyDecorators(
    ApiResponse({
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
    }),
  );
};

export const ApiNotFoundResponse = (description = 'Not Found') => {
  return applyDecorators(
    ApiResponse({
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
    }),
  );
};

export const ApiInternalServerErrorResponse = (description = 'Internal Server Error') => {
  return applyDecorators(
    ApiResponse({
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
    }),
  );
};
