import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const HTTP_METHODS = new Set([
    'get',
    'post',
    'put',
    'patch',
    'delete',
    'options',
    'head',
    'trace',
]);

export const projectPath = (...segments) => resolve(root, ...segments);

export const toPascalCase = (value) =>
    String(value)
        .replace(/[^A-Za-z0-9]+/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join('');

export const toCamelCase = (value, fallback) => {
    const pascal = toPascalCase(value);
    return pascal ? pascal[0].toLowerCase() + pascal.slice(1) : fallback;
};

export const writeFormattedFile = async (path, contents) => {
    await mkdir(dirname(path), { recursive: true });
    const config = await resolveConfig(path);
    const formatted = await format(contents, { ...config, filepath: path });
    await writeFile(path, formatted, 'utf8');
};
