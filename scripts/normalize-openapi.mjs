import {
    HTTP_METHODS,
    projectPath,
    toCamelCase,
    toPascalCase,
    writeFormattedFile,
} from './codegen-utils.mjs';

const sourceUrl = process.env.NODESTY_OPENAPI_URL ?? 'https://nodesty.com/_openapi.json';
const outputPath = projectPath('openapi/openapi.json');
const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(30_000) });

if (!response.ok) {
    throw new Error(
        `Unable to download OpenAPI document (${response.status} ${response.statusText})`,
    );
}

const document = await response.json();
if (document.openapi !== '3.1.0' || !document.paths || typeof document.paths !== 'object') {
    throw new Error('Unexpected OpenAPI document: expected OpenAPI 3.1 with a paths object');
}

const operationIds = new Set();
const usedTags = new Set();

const pathParameterNames = (path) => [...path.matchAll(/\{([^}]+)}/g)].map((match) => match[1]);

const stableSort = (value) => {
    if (Array.isArray(value)) return value.map(stableSort);
    if (!value || typeof value !== 'object') return value;
    return Object.fromEntries(
        Object.entries(value)
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([key, item]) => [key, stableSort(item)]),
    );
};

for (const [path, pathItem] of Object.entries(document.paths)) {
    const pathParams = pathParameterNames(path);
    const pathLevelParameters = Array.isArray(pathItem.parameters) ? pathItem.parameters : [];
    pathItem.parameters = pathLevelParameters.filter(
        (parameter) =>
            !(parameter.in === 'header' && parameter.name.toLowerCase() === 'authorization'),
    );

    for (const [method, operation] of Object.entries(pathItem)) {
        if (!HTTP_METHODS.has(method) || !operation || typeof operation !== 'object') continue;

        const tag = operation.tags?.[0] ?? 'Default';
        usedTags.add(tag);
        operation.tags = operation.tags?.length ? operation.tags : [tag];

        const parameters = Array.isArray(operation.parameters) ? [...operation.parameters] : [];
        // Authorization is represented by the security scheme below, not as an SDK argument.
        operation.parameters = parameters.filter(
            (parameter) =>
                !(parameter.in === 'header' && parameter.name.toLowerCase() === 'authorization'),
        );

        const allParameters = [...pathLevelParameters, ...parameters];
        const declaredPathParams = new Set(
            allParameters
                .filter((parameter) => parameter.in === 'path')
                .map((parameter) => parameter.name),
        );
        for (const name of pathParams) {
            if (!declaredPathParams.has(name)) {
                operation.parameters.push({
                    name,
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                });
            }
        }

        const isProtected = allParameters.some(
            (parameter) =>
                parameter.in === 'header' && parameter.name.toLowerCase() === 'authorization',
        );
        operation.security = isProtected ? [{ personalAccessToken: [] }] : [];

        if (!operation.operationId) {
            const summary = operation.summary || `${method} ${path}`;
            const base = toCamelCase(`${tag} ${summary}`, 'operation');
            let operationId = base;
            if (operationIds.has(operationId)) {
                operationId = `${base}${toPascalCase(method)}${toPascalCase(path)}`;
            }
            let suffix = 2;
            while (operationIds.has(operationId)) operationId = `${base}${suffix++}`;
            operation.operationId = operationId;
        }
        if (operationIds.has(operation.operationId)) {
            throw new Error(`Duplicate operationId after normalization: ${operation.operationId}`);
        }
        operationIds.add(operation.operationId);
    }
}

document.info = { ...document.info, version: document.info?.version || 'latest' };
document.components = {
    ...(document.components ?? {}),
    securitySchemes: {
        ...(document.components?.securitySchemes ?? {}),
        personalAccessToken: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Nodesty Personal Access Token, sent as `PAT <token>`.',
        },
    },
};
const existingTags = new Map(
    (document.tags ?? []).filter((tag) => tag?.name).map((tag) => [tag.name, tag]),
);
document.tags = [...usedTags]
    .sort((left, right) => left.localeCompare(right))
    .map((name) => existingTags.get(name) ?? { name });

await writeFormattedFile(outputPath, JSON.stringify(stableSort(document)));
console.log(`Normalized ${operationIds.size} operations from ${sourceUrl}`);
