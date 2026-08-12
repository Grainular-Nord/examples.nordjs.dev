import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
    base: mode === 'cloudflare' ? '/tic-tac-toe/' : '/examples/tic-tac-toe/',
    build: {
        target: 'esnext',
    },
}));
