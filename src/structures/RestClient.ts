import { ofetch } from 'ofetch';
import { defu } from 'defu';

export const API_BASE_URL = 'https://nodesty.com/api';

/**
 * Options for configuring the REST client.
 */
export interface RestClientOptions {
    /**
     * Personal authorization token (PAT) for authentication.
     * @example "ndsty_1234567890abcdef"
     */
    accessToken: string;

    /**
     * Number of retries for failed requests.
     * @default 3
     */
    retry?: number | false;

    /**
     * Timeout for requests in milliseconds.
     * @default 30000
     */
    timeout?: number;

    /**
     * Offset for rate limiting, used to manage request pacing.
     * @default 50
     */
    rateLimitOffset?: number;
}

/**
 * Represents a standard API response structure.
 */
export interface ApiResponse<T = any> {
    /**
     * Indicates whether the request was successful.
     */
    success: boolean;

    /**
     * A descriptive error message.
     */
    error?: string;

    /**
     * The data returned by the API.
     */
    data?: T;
}

export const createFetch = ({ accessToken, ...options }: RestClientOptions) =>
    ofetch.create({
        baseURL: API_BASE_URL,
        headers: {
            Authorization: `PAT ${accessToken}`,
        },
        ignoreResponseError: true,
        retryDelay: ({ response }) => {
            const rateLimitReset = response?.headers?.get('x-ratelimit-reset');
            if (rateLimitReset) {
                return Math.max(+rateLimitReset - Date.now(), 0) + (options.rateLimitOffset ?? 50);
            }

            return 1_000;
        },
        onResponse: async ({ response }) => {
            const rawData = response._data;

            if (rawData) {
                let normalizedData: ApiResponse;

                if (rawData.error) {
                    normalizedData = {
                        success: false,
                        error: rawData.message,
                    };
                } else {
                    normalizedData = {
                        success: true,
                        data: rawData,
                    };
                }

                response._data = normalizedData;
            }
        },
        ...defu(options, {
            retry: 3,
            timeout: 30_000,
        }),
    });
