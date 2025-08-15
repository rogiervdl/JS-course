import js from '@eslint/js';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		files: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
		languageOptions: {
			ecmaVersion: 2021,
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			'array-bracket-spacing': [
				'warn',
				'never'
			],
			'arrow-spacing': 'warn',
			'block-spacing': 'warn',
			'camelcase': 'warn',
			'comma-spacing': 'warn',
			'computed-property-spacing': 'warn',
			'for-direction': 'off',
			'indent': [
				'warn',
				'tab'
			],
			'quotes': [
				'error',
				'single'
			],
			'semi': [
				'error',
				'always'
			],
			'no-template-curly-in-string': [
				'error'
			],
			'no-use-before-define': [
				'error',
				{
					'functions': true,
					'classes': true,
					'variables': true
				}
			],
			'keyword-spacing': [
				'warn',
				{
					'before': true,
					'after': true
				}
			],
			'lines-around-comment': [
				'warn',
				{
					'beforeLineComment': true,
					'beforeBlockComment': true,
					'allowBlockStart': true,
					'allowObjectStart': true
				}
			],
			'lines-between-class-members': [
				'warn',
				'always'
			],
			'max-statements-per-line': [
				'warn',
				{
					'max': 1
				}
			],
			'no-alert': 'warn',
			'no-bitwise': 'warn',
			'no-caller': 'warn',
			'no-debugger': 'warn',
			'no-cond-assign': 'off',
			'no-else-return': 'warn',
			'no-empty-function': 'error',
			'no-lone-blocks': 'error',
			'no-lonely-if': 'error',
			'no-magic-numbers': [
				'warn',
				{
					'ignore': [
						-1,
						0,
						0.5,
						1,
						2,
						3,
						4,
						5,
						6,
						7,
						8,
						9,
						10,
						100,
						500,
						1000,
						2000
					]
				}
			],
			'no-useless-concat': 'error',
			'no-var': 'error',
			'require-await': 'error',
			'vars-on-top': 'error',
			'no-mixed-spaces-and-tabs': [
				'warn',
				'smart-tabs'
			],
			'no-multi-assign': 'warn',
			'no-multiple-empty-lines': [
				'warn',
				{
					'max': 2,
					'maxEOF': 1
				}
			],
			'no-multi-spaces': [
				'warn',
				{
					'ignoreEOLComments': false
				}
			],
			'nonblock-statement-body-position': [
				'warn',
				'beside'
			],
			'no-underscore-dangle': 'warn',
			'no-unexpected-multiline': 'warn',
			'no-unmodified-loop-condition': 'warn',
			'no-unneeded-ternary': 'warn',
			'no-unreachable-loop': 'warn',
			'no-unused-expressions': 'warn',
			'no-whitespace-before-property': 'warn',
			'object-curly-spacing': [
				'warn',
				'always'
			],
			'operator-linebreak': [
				'warn',
				'before'
			],
			'padded-blocks': [
				'warn',
				'never'
			],
			'prefer-const': 'warn',
			'prefer-template': 'off',
			'rest-spread-spacing': [
				'warn'
			],
			'semi-spacing': [
				'warn',
				{
					'before': false,
					'after': true
				}
			],
			'semi-style': [
				'warn',
				'last'
			],
			'space-before-blocks': [
				'warn',
				'always'
			],
			'space-before-function-paren': [
				'warn',
				'never'
			],
			'spaced-comment': [
				'warn',
				'always'
			],
			'space-infix-ops': 'warn',
			'space-in-parens': [
				'warn',
				'never'
			],
			'space-unary-ops': [
				'warn',
				{
					'words': true,
					'nonwords': false
				}
			],
			'switch-colon-spacing': 'warn'
		}
	}
];
