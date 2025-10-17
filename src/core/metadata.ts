import fs from 'node:fs'
import type { PageMetadata } from './types/types'

export function extractMetadata(filePath: string): PageMetadata | null {
	try {
		const content = fs.readFileSync(filePath, 'utf-8')

		// Парсинг JSDoc комментариев
		const jsdocMetadata = extractJSDocMetadata(content)
		if (jsdocMetadata) {
			return jsdocMetadata
		}

		// Парсинг экспорта metadata
		const exportMetadata = extractExportMetadata(content)
		if (exportMetadata) {
			return exportMetadata
		}

		return null
	} catch (error) {
		console.warn(
			`[vite-plugin-file-router] Failed to extract metadata from ${filePath}:`,
			error
		)
		return null
	}
}

function extractJSDocMetadata(content: string): PageMetadata | null {
	const jsdocMatch = content.match(/\/\*\*([\s\S]*?)\*\//)
	if (!jsdocMatch) return null

	const jsdoc = jsdocMatch[1]
	const metadata: PageMetadata = {}

	// Парсинг JSDoc тегов
	const titleMatch = jsdoc.match(/@title\s+(.+)/)
	if (titleMatch) metadata.title = titleMatch[1].trim()

	const descMatch = jsdoc.match(/@description\s+(.+)/)
	if (descMatch) metadata.description = descMatch[1].trim()

	const keywordsMatch = jsdoc.match(/@keywords\s+(.+)/)
	if (keywordsMatch) {
		metadata.keywords = keywordsMatch[1].split(',').map(k => k.trim())
	}

	const authorMatch = jsdoc.match(/@author\s+(.+)/)
	if (authorMatch) metadata.author = authorMatch[1].trim()

	const changefreqMatch = jsdoc.match(
		/@changefreq\s+(always|hourly|daily|weekly|monthly|yearly|never)/
	)
	if (changefreqMatch) {
		metadata.changefreq = changefreqMatch[1] as PageMetadata['changefreq']
	}

	const priorityMatch = jsdoc.match(/@priority\s+([0-9.]+)/)
	if (priorityMatch) {
		metadata.priority = parseFloat(priorityMatch[1])
	}

	return Object.keys(metadata).length > 0 ? metadata : null
}

function extractExportMetadata(content: string): PageMetadata | null {
	// Ищем экспорт const metadata = { ... }
	const metadataMatch = content.match(
		/export\s+const\s+metadata\s*=\s*({[\s\S]*?});?/
	)
	if (!metadataMatch) return null

	try {
		// Безопасное выполнение кода для извлечения объекта
		const metadataCode = metadataMatch[1]
		// Заменяем возможные импорты и функции на безопасные значения
		const safeCode = metadataCode
			.replace(/import\s+.*?from\s+['"][^'"]*['"];?/g, '')
			.replace(/require\s*\([^)]*\)/g, '""')
			.replace(/process\.env\.[A-Z_]+/g, '""')

		// Создаем функцию для безопасного выполнения
		const func = new Function(`return ${safeCode}`)
		return func()
	} catch (error) {
		console.warn(
			`[vite-plugin-file-router] Failed to parse metadata export:`,
			error
		)
		return null
	}
}

export function generateSitemap(
	routes: Array<{ path: string; metadata?: PageMetadata }>,
	baseUrl: string
): string {
	const urls = routes
		.map(route => {
			const lastmod = new Date().toISOString()
			const changefreq = route.metadata?.changefreq || 'monthly'
			const priority = route.metadata?.priority || 0.8

			return `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
		})
		.join('\n')

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}

export function generateRobots(
	baseUrl: string,
	disallowPaths: string[] = []
): string {
	const disallowRules = disallowPaths
		.map(path => `Disallow: ${path}`)
		.join('\n')

	return `User-agent: *
Allow: /
${disallowRules ? `\n${disallowRules}` : ''}

Sitemap: ${baseUrl}/sitemap.xml`
}
