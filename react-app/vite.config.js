import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: '../electron-app/src/screens/main/build',
        emptyOutDir: true
    },
});