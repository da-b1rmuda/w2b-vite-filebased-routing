import path from 'node:path'
import { collectLayouts } from './scanner'
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
	// Фильтруем группы маршрутов (папки в скобках)
	const filteredParts = parts.filter(
		part => !part.startsWith('(') || !part.endsWith(')')
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

	return {
		id,
		path: route,
		filePath: slash(filePath),
		loader,
		exportType,
		layouts,
	}
}
