import fs from 'node:fs'
import path from 'node:path'
import { createRouteEntry } from './route-generator'
import { scanPages } from './scanner'
import type { Options } from './types/types'
import { slash } from './utils'

export async function generateVirtualModuleCode(
	resolvedPagesDir: string,
	opts: Required<Options>
): Promise<string> {
	const pages = await scanPages(resolvedPagesDir, opts)
	const entries = pages.map(fp => {
		const entry = createRouteEntry(fp, resolvedPagesDir, opts)
		return `{
      id: ${JSON.stringify(entry.id)},
      path: ${JSON.stringify(entry.path)},
      filePath: ${JSON.stringify(entry.filePath)},
      loader: ${entry.loader},
      exportType: ${JSON.stringify(entry.exportType)},
      layouts: [${entry.layouts.join(',')}],
      ${entry.layoutsMobile ? `layoutsMobile: [${entry.layoutsMobile.join(',')}],` : ''}
      ${entry.layoutsPC ? `layoutsPC: [${entry.layoutsPC.join(',')}],` : ''}
      ${entry.loading ? `loading: ${entry.loading},` : ''}
      ${entry.notFound ? `notFound: ${entry.notFound},` : ''}
      ${entry.error ? `error: ${entry.error},` : ''}
    }`
	})

	// Ищем глобальный not-found в корне pages
	let globalNotFound: string | undefined
	for (const ext of opts.extensions) {
		const notFoundPath = path.resolve(
			resolvedPagesDir,
			`${opts.notFoundFileName}.${ext}`
		)
		if (fs.existsSync(notFoundPath)) {
			globalNotFound = `() => import(${JSON.stringify(slash(notFoundPath))})`
			break
		}
	}

	return `// Auto-generated routes manifest
const manifest = [${entries.join(',\n')}];

export const basePath = ${JSON.stringify(opts.basePath ?? '/')};
${globalNotFound ? `export const globalNotFound = ${globalNotFound};` : 'export const globalNotFound = undefined;'}
export const breakpoints = ${JSON.stringify(opts.breakpoints ?? null)};

export { manifest };
export default manifest;
`
}
