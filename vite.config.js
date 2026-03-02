import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        proxy: {
            '/ai-img': {
                target: 'https://image.pollinations.ai',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/ai-img/, '/prompt'),
                secure: false, // Ensure SSL errors don't crash the proxy
            },
        },
    },
});
