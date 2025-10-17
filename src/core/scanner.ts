import fg from 'fast-glob'
import fs from 'node:fs'
import path from 'node:path'
import type { Options } from './types/types'
import { slash } from './utils'

export async function scanPages(
	resolvedPagesDir: string,
	opts: Required<Options>
): Promise<string[]> {
	// pattern like /abs/path/**/page.tsx
	const exts = opts.extensions.join('|')
	const pattern = `${slash(resolvedPagesDir)}/**/${
		opts.pageFileName
	}.+(${exts})`
	const files = await fg(pattern, { dot: true })
	// return absolute normalized paths
	return files.map((f: string) => path.resolve(f))
}

export function collectLayouts(
	filePath: string,
	resolvedPagesDir: string,
	opts: Required<Options>
): string[] {
	const rel = slash(path.relative(resolvedPagesDir, filePath))
	const dir = path.dirname(rel)
	const parts = dir === '.' ? [] : dir.split('/').filter(Boolean)

	const layouts: string[] = []
	// for each level from 0..parts.length include layout if exists
	// НЕ фильтруем группы маршрутов при поиске layout файлов
	for (let i = 0; i <= parts.length; i++) {
		const p = parts.slice(0, i).join('/')
		for (const ext of opts.extensions) {
			const candidate = path.resolve(
				resolvedPagesDir,
				p || '',
				`${opts.layoutFileName}.${ext}`
			)
			if (fs.existsSync(candidate)) {
				layouts.push(candidate)
				break
			}
		}
	}
	return layouts
}
