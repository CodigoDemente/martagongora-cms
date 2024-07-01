/** @type { import("eslint").Linter.Config } */
module.exports = {
	root: true,
	extends: ['eslint:recommended', 'prettier'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	overrides: [
		{
			files: ['*.ts', '*.tsx']
		}
	],
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
