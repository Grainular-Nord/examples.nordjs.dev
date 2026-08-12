import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
    base: mode === 'cloudflare' || process.env.CF_PAGES ? '/hnr/' : '/examples/hnr/',
}));
