import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['./src'],
    target: 'esnext',
    tsconfig: true,
    dts: true,
    minify: true,
});
