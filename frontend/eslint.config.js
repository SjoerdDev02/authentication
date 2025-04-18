import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import cssPlugin from 'eslint-plugin-css';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

import pluginNext from '@next/eslint-plugin-next'

export default [
	// Base recommended ESLint rules
	js.configs.recommended,
	...tseslint.configs.recommended,

	// JS files configuration
	{
		files: ['**/*.js', '**/*.jsx'],
		plugins: {
			'@stylistic': stylistic,
			'simple-import-sort': simpleImportSort,
			'react': react,
			'react-hooks': reactHooks,
			'@next/next': pluginNext
		},
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				React: 'readonly',
				JSX: 'readonly',
			},
		},
		rules: {
			...pluginNext.configs.recommended.rules,
			
			// General rules
			'no-unused-vars': 'error',
			'semi': 'error',
			'indent': ['error', 'tab'],
			'prefer-template': 'error',

			// Import sorting
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',

			// Stylistic rules
			'@stylistic/no-trailing-spaces': 'error',
			'@stylistic/jsx-sort-props': 'error',
			'@stylistic/jsx-quotes': ['error', 'prefer-double'],
			'@stylistic/comma-spacing': ['error', { 'before': false, 'after': true }],

			// React rules
			'react/jsx-max-props-per-line': ['error', { 'when': 'always' }],
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',

			// Import restrictions
			'no-restricted-imports': ['error', { 'patterns': ['./*', '../*'] }],
		},
	},

	// TS files configuration
	{
		files: ['**/*.ts', '**/*.tsx'],
		plugins: {
			'@stylistic': stylistic,
			'simple-import-sort': simpleImportSort,
			'react': react,
			'react-hooks': reactHooks,
			'@typescript-eslint': tseslint.plugin,
			'@next/next': pluginNext
		},
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
				},
				project: './tsconfig.json',
			},
			globals: {
				React: 'readonly',
				JSX: 'readonly',
			},
		},
		rules: {
			...pluginNext.configs.recommended.rules,
			
			// Disable JS rule in favor of TS rule
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'error',

			// General rules
			'semi': 'error',
			'indent': ['error', 'tab'],
			'prefer-template': 'error',

			// Import sorting
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',

			// Stylistic rules
			'@stylistic/no-trailing-spaces': 'error',
			'@stylistic/jsx-sort-props': 'error',
			'@stylistic/jsx-quotes': ['error', 'prefer-double'],
			'@stylistic/comma-spacing': ['error', { 'before': false, 'after': true }],

			// React rules
			'react/jsx-max-props-per-line': ['error', { 'when': 'always' }],
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',

			// Import restrictions
			'no-restricted-imports': ['error', { 'patterns': ['./*', '../*'] }],
		},
	},

	// Test files configuration
	{
		files: ['tests/**/*.ts'],
		rules: {
			'react-hooks/rules-of-hooks': 'off',
		},
	},

	// CSS files configuration
	{
		files: ['**/*.css'],
		plugins: {
			'css': cssPlugin,
		},
		languageOptions: {
			parser: cssPlugin.parser,
		}
	},
];