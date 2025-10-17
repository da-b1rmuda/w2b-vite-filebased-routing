import fs from 'node:fs'
import path from 'node:path'
import { extractMetadata, generateRobots, generateSitemap } from './metadata'
import { createRouteEntry } from './route-generator'
import { scanPages } from './scanner'
import { generateMetadataTypes, generateRouteTypes } from './type-generator'
import type { Options } from './types/types'

export async function generateTypes(
	resolvedPagesDir: string,
	opts: Required<Options>
) {
	const pages = await scanPages(resolvedPagesDir, opts)
	const routes = pages.map(fp => createRouteEntry(fp, resolvedPagesDir, opts))

	const routeTypes = generateRouteTypes(routes)
	const metadataTypes = generateMetadataTypes()

	// Создаем директорию для типов
	const typesDir = path.join(process.cwd(), 'dist', 'types')
	if (!fs.existsSync(typesDir)) {
		fs.mkdirSync(typesDir, { recursive: true })
	}

	fs.writeFileSync(path.join(typesDir, 'routes.d.ts'), routeTypes)
	fs.writeFileSync(path.join(typesDir, 'metadata.d.ts'), metadataTypes)
}

export async function generateSEOFiles(
	resolvedPagesDir: string,
	opts: Required<Options>
) {
	const pages = await scanPages(resolvedPagesDir, opts)
	const routesWithMetadata = pages
		.map(fp => {
			const entry = createRouteEntry(fp, resolvedPagesDir, opts)
			const metadata = extractMetadata(fp)
			return {
				path: entry.path,
				metadata: metadata || undefined,
			}
		})
		.filter(
			route =>
				!opts.disallowPaths.some(disallow => route.path.startsWith(disallow))
		)

	// Генерируем sitemap.xml и robots.txt
	const sitemap = generateSitemap(routesWithMetadata, opts.baseUrl)
	const robots = generateRobots(opts.baseUrl, opts.disallowPaths)

	const distDir = path.join(process.cwd(), 'dist')
	if (!fs.existsSync(distDir)) {
		fs.mkdirSync(distDir, { recursive: true })
	}

	fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap)
	fs.writeFileSync(path.join(distDir, 'robots.txt'), robots)
}
