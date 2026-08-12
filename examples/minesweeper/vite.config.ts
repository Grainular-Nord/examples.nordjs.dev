import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
export default defineConfig(({ mode }) => ({
    base: mode === 'cloudflare' ? '/minesweeper/' : '/examples/minesweeper/',
    plugins: [tailwindcss()],
}));
