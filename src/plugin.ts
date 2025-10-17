import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import { generateSEOFiles, generateTypes } from './core/build-generator'
import { createHMRHandlers } from './core/hmr-handlers'
import { loadGeneratedManifest } from './core/manifest-loader'
import type { Options } from './core/types/types'
import { generateVirtualModuleCode } from './core/virtual-module'

export type { Options } from './core/types/types'

export function w2bViteFileBasedRouting(rawOpts: Options = {}): Plugin {
	const opts: Required<Options> = {
		pagesDir: rawOpts.pagesDir ?? 'src/pages',
		pageFileName: rawOpts.pageFileName ?? 'page',
		layoutFileName: rawOpts.layoutFileName ?? 'layout',
		extensions: rawOpts.extensions ?? ['tsx'],
		baseUrl: rawOpts.baseUrl ?? 'http://localhost:5173',
		disallowPaths: rawOpts.disallowPaths ?? [],
		generateTypes: rawOpts.generateTypes ?? true,
		enableSEO: rawOpts.enableSEO ?? true,
	}

	const VIRTUAL_ID = 'virtual:routes'
	const RESOLVED_VIRTUAL_ID = '\0' + VIRTUAL_ID
	let root = process.cwd()
	let resolvedPagesDir = path.resolve(root, opts.pagesDir)

	const plugin: Plugin = {
		name: 'vite-plugin-file-router-mwv',
		enforce: 'pre',

		resolveId(id: string) {
			if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID
			return null
		},

		async load(id: string) {
			if (id === RESOLVED_VIRTUAL_ID) {
				// В production режиме проверяем существование директории pages
				if (!fs.existsSync(resolvedPagesDir)) {
					// В production пытаемся загрузить сгенерированный манифест
					return await loadGeneratedManifest(root)
				}

				return await generateVirtualModuleCode(resolvedPagesDir, opts)
			}
			return null
		},

		async buildStart() {
			root = process.cwd()
			resolvedPagesDir = path.resolve(root, opts.pagesDir)

			if (!fs.existsSync(resolvedPagesDir)) {
				console.warn(
					`[vite-plugin-file-router] pagesDir "${resolvedPagesDir}" not found.`
				)
			}
		},

		async generateBundle() {
			// Проверяем существование директории pages
			if (!fs.existsSync(resolvedPagesDir)) {
				console.warn(
					`[vite-plugin-file-router] pagesDir "${resolvedPagesDir}" not found in production build. Skipping route generation.`
				)
				return
			}

			// Генерируем TypeScript типы
			if (opts.generateTypes) {
				try {
					await generateTypes(resolvedPagesDir, opts)
				} catch (error) {
					console.warn(
						`[vite-plugin-file-router] Failed to generate types: ${error}`
					)
				}
			}

			// Генерируем SEO файлы
			if (opts.enableSEO) {
				try {
					await generateSEOFiles(resolvedPagesDir, opts)
				} catch (error) {
					console.warn(
						`[vite-plugin-file-router] Failed to generate SEO files: ${error}`
					)
				}
			}
		},
	}

	// Добавляем HMR только если в development режиме
	if (process.env.NODE_ENV !== 'production') {
		const { configureServer, handleHotUpdate } = createHMRHandlers(
			resolvedPagesDir,
			RESOLVED_VIRTUAL_ID,
			root
		)
		plugin.configureServer = configureServer
		plugin.handleHotUpdate = handleHotUpdate
	}

	return plugin
}
