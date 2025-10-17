import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/core.ts', 'src/plugin.ts', 'src/react.ts'],
	format: ['esm', 'cjs'],
	dts: true,
	clean: true,
	sourcemap: true,
	outDir: 'dist',
	outExtension({ format }) {
		return {
			js: format === 'esm' ? '.mjs' : '.js',
			dts: '.d.ts',
		}
	},
	external: [
		'react',
		'react-dom',
		'vite',
		'react-router-dom',
		'fast-glob',
		'virtual:routes',
	],
})
