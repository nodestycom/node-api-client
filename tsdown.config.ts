import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['./src/index.ts'],
    target: 'es2022',
    tsconfig: true,
    dts: true,
    minify: true,
});
