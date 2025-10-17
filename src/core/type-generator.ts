import type { RouteEntry } from './types/types'

export function generateRouteTypes(routes: RouteEntry[]): string {
	const routePaths = routes.map(route => `'${route.path}'`).join(' | ')

	// Извлекаем параметры из динамических маршрутов
	const routeParams: Record<string, Record<string, string>> = {}
	routes.forEach(route => {
		const params: Record<string, string> = {}

		// Парсим [id] параметры
		const idMatches = route.path.match(/\[([^\]]+)\]/g)
		if (idMatches) {
			idMatches.forEach(match => {
				const paramName = match.slice(1, -1)
				if (paramName.startsWith('...')) {
					// Catch-all параметр
					params[paramName.slice(3)] = 'string[]'
				} else {
					params[paramName] = 'string'
				}
			})
		}

		if (Object.keys(params).length > 0) {
			routeParams[route.path] = params
		}
	})

	const routeParamsType =
		Object.keys(routeParams).length > 0
			? `export type RouteParams = {
${Object.entries(routeParams)
	.map(([path, params]) => {
		const paramEntries = Object.entries(params)
			.map(([key, type]) => `${key}: ${type}`)
			.join(', ')
		return `  '${path}': { ${paramEntries} }`
	})
	.join('\n')}
}`
			: 'export type RouteParams = Record<string, never>'

	return `// Автогенерированные типы маршрутов
export type RoutePath = ${routePaths || 'never'}

${routeParamsType}

export type PageProps<T extends RoutePath = RoutePath> = {
  params: RouteParams[T]
  searchParams?: Record<string, string>
}

export interface LayoutProps {
  children: React.ReactNode
}

export interface RouteInfo {
  id: string
  path: string
  filePath: string
  exportType: 'default' | 'named'
  layouts: string[]
}

// Утилиты для навигации
export function navigate<T extends RoutePath>(
  path: T, 
  params?: RouteParams[T]
): void {
  // Реализация навигации
  window.location.href = path
}

export function useParams<T extends RoutePath>(): RouteParams[T] {
  // Реализация хука для получения параметров
  return {} as RouteParams[T]
}
`
}

export function generateMetadataTypes(): string {
	return `// Типы для метаданных страниц
export interface PageMetadata {
  title?: string
  description?: string
  keywords?: string[]
  author?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export interface SEOConfig {
  baseUrl: string
  defaultTitle?: string
  defaultDescription?: string
  disallowPaths?: string[]
}
`
}
