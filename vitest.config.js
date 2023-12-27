import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        include: ['tests/**/*'],
        globals: true,
        coverage: {
            reporter: ['text', 'html'],
        },
    },
    build: {
        sourcemap: true,
    },
    rootDir: './', // define the root directory for your project
});
