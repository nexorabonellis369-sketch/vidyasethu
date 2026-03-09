import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 5173,
        strictPort: true,
        proxy: {
            '/ai-img': {
                target: 'https://image.pollinations.ai',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/ai-img/, '/prompt'),
                secure: false,
            },
            '/ai-chat': {
                target: 'https://text.pollinations.ai',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/ai-chat/, ''),
                secure: false,
            },
        },
    },
});
