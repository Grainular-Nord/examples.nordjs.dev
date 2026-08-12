import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
    base: mode === 'cloudflare' ? '/game-of-life/' : '/examples/game-of-life/',
    build: {
        target: 'esnext',
    },
}));
