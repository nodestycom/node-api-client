// Convert legacy nullable annotations before passing an OpenAPI 3.1 schema to codegen.
export const normalizeNullableSchemas = (document) => {
    const normalizeSchema = (schema) => {
        if (!schema || typeof schema !== 'object') return;

        if (schema.nullable === true && schema.type) {
            const types = Array.isArray(schema.type) ? schema.type : [schema.type];
            schema.type = [...new Set([...types, 'null'])];
            if (Array.isArray(schema.enum) && !schema.enum.includes(null)) schema.enum.push(null);
            delete schema.nullable;
        }

        for (const key of ['properties', 'patternProperties', '$defs', 'dependentSchemas']) {
            for (const child of Object.values(schema[key] ?? {})) normalizeSchema(child);
        }
        for (const key of [
            'items',
            'additionalProperties',
            'not',
            'if',
            'then',
            'else',
            'contains',
        ]) {
            normalizeSchema(schema[key]);
        }
        for (const key of ['allOf', 'anyOf', 'oneOf', 'prefixItems']) {
            for (const child of schema[key] ?? []) normalizeSchema(child);
        }
    };

    const visit = (value) => {
        if (!value || typeof value !== 'object') return;
        for (const [key, child] of Object.entries(value)) {
            if (['example', 'examples', 'default'].includes(key)) continue;
            if (key === 'schema') normalizeSchema(child);
            else visit(child);
        }
    };

    visit(document);
    for (const schema of Object.values(document.components?.schemas ?? {})) normalizeSchema(schema);
};
