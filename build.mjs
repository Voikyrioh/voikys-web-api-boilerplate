import * as esbuild from 'esbuild';

await esbuild.build({
	entryPoints: ['src/index.ts'],
	bundle: true,
	platform: 'node',
	target: 'node22',
	format: 'esm',
	outfile: 'dist/index.js',
	packages: 'external',
	alias: {
		'@config': './src/config/index.ts',
		'@libraries': './libraries/index.ts',
		'@entities': './src/domain/entities/index.ts',
		'@custom-zod': './libraries/custom-zod-types/index.ts',
	},
});

console.log('Build complete → dist/index.js');
