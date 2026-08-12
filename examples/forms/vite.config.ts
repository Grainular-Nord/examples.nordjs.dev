import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
export default defineConfig(({ mode }) => ({
    base: mode === 'cloudflare' ? '/forms/' : '/examples/forms/',
    plugins: [tailwindcss()],
}));
