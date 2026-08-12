import { defineConfig } from 'vite';

export default defineConfig({
    base: process.env.CF_PAGES ? '/' : '/examples/hnr/',
});
