import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	test: {
		setupFiles: './__tests__/vitest-setup.ts',
		environment: 'jsdom',
		globals: true,
		include: ['**/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}'],
	},
	resolve: {
		alias: {
			'@/ci': resolve(__dirname, './__tests__'),
			'@/e2e': resolve(__dirname, './tests'),
			'@': resolve(__dirname, './src'),
		}
	}
});