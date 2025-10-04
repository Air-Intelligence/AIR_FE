// 미사용

import type { HTTPError } from "ky";

export interface ApiResponse<T> {
    statusCode: number;
    content: T;
    timestamp: string;
}

export interface ApiErrorResponse {
    statusCode: number;
    errorName: string;
    message: string;
    timestamp: string;
}

export type KyHttpError = HTTPError<ApiErrorResponse>;

export type ExtendedKyHttpError = KyHttpError & {
    errorData: ApiErrorResponse;
};
