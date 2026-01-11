import path from 'node:path'
import { collectLayouts, collectAdaptiveLayouts, findSpecialFile } from './scanner'
import type { Options, RouteEntry } from './types/types'
import { detectExportType, slash } from './utils'

export function segmentToRoute(seg: string): string {
	if (/^\[\.{3}.+\]$/.test(seg)) {
		const name = seg.slice(4, -1)
		return `:${name}(.*)`
	}
	if (/^\[.+\]$/.test(seg)) {
		const name = seg.slice(1, -1)
		return `:${name}`
	}
	return seg
}

export function filePathToRoute(
	filePath: string,
	resolvedPagesDir: string
): string {
	const rel = slash(path.relative(resolvedPagesDir, filePath))
	const dir = path.dirname(rel)
	const parts = dir === '.' ? [] : dir.split('/').filter(Boolean)
	// 1. Выбрасываем группы маршрутов (auth), (shop) …
	// 2. Добавляем фильтр папок, начинающихся с _
	const filteredParts = parts.filter(
		part =>
			(!part.startsWith('(') || !part.endsWith(')')) && !part.startsWith('_')
	)
	const segments = filteredParts.map(segmentToRoute)
	const route = '/' + segments.join('/')
	return route === '/' ? '/' : route.replace(/\/+/g, '/')
}

export function createRouteEntry(
	filePath: string,
	resolvedPagesDir: string,
	opts: Required<Options>
): RouteEntry {
	const route = filePathToRoute(filePath, resolvedPagesDir)
	const id = slash(path.relative(resolvedPagesDir, filePath))
		.replace(/\//g, '_')
		.replace(/\.[^.]+$/, '')
	const exportType = detectExportType(filePath)
	const loader = `() => import(${JSON.stringify(slash(filePath))})`
	const layouts = collectLayouts(filePath, resolvedPagesDir, opts).map(
		lp => `() => import(${JSON.stringify(slash(lp))})`
	)

	// Адаптивные layouts (если breakpoints настроены)
	let layoutsMobile: string[] | undefined
	let layoutsPC: string[] | undefined
	
	if (opts.breakpoints) {
		const adaptiveLayouts = collectAdaptiveLayouts(filePath, resolvedPagesDir, opts)
		layoutsMobile = adaptiveLayouts.mobile.map(
			lp => `() => import(${JSON.stringify(slash(lp))})`
		)
		layoutsPC = adaptiveLayouts.pc.map(
			lp => `() => import(${JSON.stringify(slash(lp))})`
		)
	}

	// Ищем специальные файлы
	const loading = findSpecialFile(filePath, resolvedPagesDir, opts, 'loading')
	const notFound = findSpecialFile(filePath, resolvedPagesDir, opts, 'not-found')
	const error = findSpecialFile(filePath, resolvedPagesDir, opts, 'error')

	return {
		id,
		path: route,
		filePath: slash(filePath),
		loader,
		exportType,
		layouts,
		layoutsMobile,
		layoutsPC,
		loading: loading ? `() => import(${JSON.stringify(slash(loading))})` : undefined,
		notFound: notFound ? `() => import(${JSON.stringify(slash(notFound))})` : undefined,
		error: error ? `() => import(${JSON.stringify(slash(error))})` : undefined,
	}
}
