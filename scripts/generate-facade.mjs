import { readFile } from 'node:fs/promises';

import {
    HTTP_METHODS,
    projectPath,
    toCamelCase,
    toPascalCase,
    writeFormattedFile,
} from './codegen-utils.mjs';

const spec = JSON.parse(await readFile(projectPath('openapi/openapi.json'), 'utf8'));
const generatedSdk = await readFile(projectPath('src/generated/sdk.gen.ts'), 'utf8');
const generatedTypes = await readFile(projectPath('src/generated/types.gen.ts'), 'utf8');
const generatedOperations = new Map(
    [
        ...generatedSdk.matchAll(
            /export const (\w+) =[\s\S]*?\)\.(get|post|put|patch|delete|options|head|trace)<[\s\S]*?url: '([^']+)'/g,
        ),
    ].map((match) => [`${match[2]} ${match[3]}`, match[1]]),
);
const operations = [];

for (const [path, pathItem] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(pathItem)) {
        if (!HTTP_METHODS.has(method)) continue;

        const tag = operation.tags?.[0] ?? 'Default';
        const tagPrefix = toCamelCase(tag, 'category');
        if (!operation.operationId.startsWith(tagPrefix)) {
            throw new Error(`Operation ID does not start with its tag: ${operation.operationId}`);
        }

        const functionName = generatedOperations.get(`${method} ${path}`);
        if (!functionName) {
            throw new Error(
                `Unable to match generated SDK function for ${method.toUpperCase()} ${path}`,
            );
        }
        const dataType = `${functionName[0].toUpperCase()}${functionName.slice(1)}Data`;
        if (!generatedTypes.includes(`export type ${dataType} =`)) {
            throw new Error(`Unable to match generated data type for ${functionName}`);
        }

        operations.push({
            body: Boolean(operation.requestBody?.content),
            bodyRequired: operation.requestBody?.required === true,
            dataType,
            functionName,
            methodName: functionName
                .slice(tagPrefix.length)
                .replace(/^./, (character) => character.toLowerCase()),
            pathParameters: [...(pathItem.parameters ?? []), ...(operation.parameters ?? [])]
                .filter((parameter) => parameter.in === 'path')
                .map((parameter) => parameter.name),
            tag,
            tagClass: `${toPascalCase(tag)}Client`,
            tagProperty: tagPrefix,
        });
    }
}

if (operations.length !== generatedOperations.size) {
    throw new Error('Generated SDK operation count does not match the normalized OpenAPI document');
}

const categories = [...new Map(operations.map((operation) => [operation.tag, operation])).values()];
const sdkImports = operations.map((operation) => `    ${operation.functionName}`).join(',\n');
const typeImports = operations.map((operation) => `    ${operation.dataType}`).join(',\n');
const categoryClasses = categories
    .map((category) => {
        const categoryOperations = operations.filter((operation) => operation.tag === category.tag);
        const methodsSource = categoryOperations
            .map((operation) => {
                const pathArguments = operation.pathParameters.map(
                    (parameter) =>
                        `${parameter}: ${operation.dataType}['path'][${JSON.stringify(parameter)}]`,
                );
                const bodyArgument = operation.body
                    ? `data${operation.bodyRequired ? '' : '?'}: NonNullable<${operation.dataType}['body']>`
                    : null;
                const argumentsList = [
                    ...pathArguments,
                    bodyArgument,
                    `options?: FacadeOptions<${operation.dataType}>`,
                ]
                    .filter(Boolean)
                    .join(', ');
                const requestFields = [
                    '...options',
                    'client: this.client',
                    operation.pathParameters.length
                        ? `path: { ${operation.pathParameters.join(', ')} }`
                        : null,
                    operation.body ? 'body: data' : null,
                ]
                    .filter(Boolean)
                    .join(',\n            ');

                return `    public ${operation.methodName}(
        ${argumentsList}
    ): Promise<Awaited<ReturnType<typeof ${operation.functionName}>>> {
        return normalizeResponse(${operation.functionName}({
            ${requestFields}
        }));
    }`;
            })
            .join('\n\n');

        return `export class ${category.tagClass} {
    public constructor(private readonly client: NodestyClient) {}

${methodsSource}
}`;
    })
    .join('\n\n');

const generatedClientProperties = categories
    .map((category) => `    public readonly ${category.tagProperty}: ${category.tagClass};`)
    .join('\n');
const generatedClientAssignments = categories
    .map((category) => `        this.${category.tagProperty} = new ${category.tagClass}(client);`)
    .join('\n');

const source = `// This file is auto-generated by scripts/generate-facade.mjs

import type { NodestyClient } from '../client';
import type { TDataShape } from './client';
import {
${sdkImports}
} from './sdk.gen';
import type {
${typeImports}
} from './types.gen';
import type { Options as SdkOptions } from './sdk.gen';

type FacadeOptions<TData extends TDataShape> = Omit<SdkOptions<TData>, 'body' | 'client' | 'path'>;

const normalizeResponse = async <T>(request: T): Promise<Awaited<T>> => {
    const result = await request;
    if (!result || typeof result !== 'object' || !('response' in result)) {
        return result as Awaited<T>;
    }

    const response = result.response as { status?: number };
    return (response.status === 204 ? { ...result, data: undefined } : result) as Awaited<T>;
};

${categoryClasses}

export class GeneratedNodestyApiClient {
${generatedClientProperties}

    public constructor(public readonly client: NodestyClient) {
${generatedClientAssignments}
    }
}
`;

await writeFormattedFile(projectPath('src/generated/facade.gen.ts'), source);
console.log(`Generated grouped facade for ${operations.length} operations`);
