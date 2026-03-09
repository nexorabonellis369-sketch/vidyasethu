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
                target: 'https://enter.pollinations.ai',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/ai-chat/, ''),
                secure: false,
            },
            '/google-ai': {
                target: 'https://generativelanguage.googleapis.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/google-ai/, ''),
                secure: false,
            },
            '/openrouter-ai': {
                target: 'https://openrouter.ai/api/v1',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/openrouter-ai/, ''),
                secure: false,
            },
        },
    },
});
