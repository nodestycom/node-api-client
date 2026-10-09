import { readFile } from 'node:fs/promises';
import { projectPath, writeFormattedFile } from './codegen-utils.mjs';

// Keep these corrections in codegen so regeneration cannot restore upstream bugs.
const clientPath = projectPath('src/generated/client/client.gen.ts');
const clientSource = await readFile(clientPath, 'utf8');
const emptyResponse =
    "if (response.status === 204 || response.headers.get('Content-Length') === '0') {";
if (clientSource.split(emptyResponse).length !== 2) {
    throw new Error('Generated fetch client changed: review the empty-response correction');
}
await writeFormattedFile(
    clientPath,
    clientSource.replace(
        emptyResponse,
        `if (response.status === 204) {
            return opts.responseStyle === 'data' ? undefined : { data: undefined, ...result };
        }

        if (response.headers.get('Content-Length') === '0') {`,
    ),
);

const sdkPath = projectPath('src/generated/sdk.gen.ts');
const sdkSource = await readFile(sdkPath, 'utf8');
const optionsType = 'ClientOptions<TData, ThrowOnError> & {';
if (sdkSource.split(optionsType).length !== 2 || !sdkSource.includes('...options,')) {
    throw new Error('Generated SDK changed: review the response-style correction');
}
// SDK signatures use the fields response style. Enforce it even with a custom raw client.
await writeFormattedFile(
    sdkPath,
    sdkSource
        .replace(optionsType, "Omit<ClientOptions<TData, ThrowOnError>, 'responseStyle'> & {")
        .replaceAll('...options,', "...options,\n        responseStyle: 'fields',"),
);
