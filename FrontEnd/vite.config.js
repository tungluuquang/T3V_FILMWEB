import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8800/',
                changeOrigin: true,
                secure: false,
            },
            '/recommender': {
                // target: 'http://localhost:8000',
                target: 'https://1572-116-96-45-20.ngrok-free.app',
                changeOrigin: true,
                secure: false,
            }
        },
        watch: {
            usePolling: true,
            interval: 100,
        },
    },
    test: {
        watch: false,
        threads: false,
        workers: 1,
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.js'],
    }
})
