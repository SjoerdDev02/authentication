import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['**/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}']
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
			'@/e2e': resolve(__dirname, './tests'),
			'@/ci': resolve(__dirname, './__tests__'),
		}
	}
});