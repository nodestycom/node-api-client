import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeNullableSchemas } from '../scripts/normalize-schema.mjs';

test('normalizes nullable request and response fields without changing example payloads', () => {
    const schema = {
        type: 'object',
        properties: {
            value: { type: 'string', nullable: true },
            options: { type: 'object', nullable: true, additionalProperties: { type: 'number' } },
            items: { type: 'array', items: { type: 'integer', nullable: true } },
        },
        example: { nullable: true, type: 'string' },
    };
    const document = {
        paths: {
            '/example': { post: { requestBody: { content: { 'application/json': { schema } } } } },
        },
    };

    normalizeNullableSchemas(document);

    assert.deepEqual(schema.properties.value, { type: ['string', 'null'] });
    assert.deepEqual(schema.properties.options.type, ['object', 'null']);
    assert.deepEqual(schema.properties.items.items, { type: ['integer', 'null'] });
    assert.deepEqual(schema.example, { nullable: true, type: 'string' });
});

test('normalizes component and composed schemas idempotently, including nullable enums', () => {
    const document = {
        components: {
            schemas: {
                Example: {
                    anyOf: [
                        { type: 'string', enum: ['enabled'], nullable: true },
                        { type: ['integer', 'null'], nullable: true },
                    ],
                },
            },
        },
    };

    normalizeNullableSchemas(document);
    assert.deepEqual(document.components.schemas.Example.anyOf, [
        { type: ['string', 'null'], enum: ['enabled', null] },
        { type: ['integer', 'null'] },
    ]);
    const normalized = structuredClone(document);
    normalizeNullableSchemas(document);
    assert.deepEqual(document, normalized);
});
