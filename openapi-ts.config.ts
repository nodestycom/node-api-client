import { defineConfig } from '@hey-api/openapi-ts';
import { resolve } from 'node:path';

export default defineConfig({
    input: { path: resolve('openapi/openapi.json') },
    output: {
        path: 'src/generated',
        clean: true,
        format: 'prettier',
        lint: false,
    },
    plugins: [
        {
            name: '@hey-api/client-fetch',
            baseUrl: false,
        },
        '@hey-api/typescript',
        {
            name: '@hey-api/sdk',
            responseStyle: 'fields',
            exportFromIndex: true,
        },
    ],
});
