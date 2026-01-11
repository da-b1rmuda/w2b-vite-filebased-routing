export type Options = {
	/**
	 * 📁 Директория страниц
	 *
	 * ▸ Относительный путь от корня проекта
	 *
	 * ▸ Используется для поиска файлов страниц и layouts
	 *
	 * @example 'src/views'
	 * @example 'app/pages'
	 *
	 * @default 'src/pages'
	 */
	pagesDir?: string
	/**
	 * 📄 Имя файла страницы
	 *
	 * ▸ Файлы с этим именем считаются страницами
	 *
	 * ▸ Поддерживает вложенность для маршрутизации
	 *
	 * @default 'page'
	 */
	pageFileName?: string
	/**
	 * 🏗️ Имя файла layout
	 *
	 * ▸ Файлы с этим именем считаются layouts
	 *
	 * ▸ Автоматически применяются к вложенным страницам
	 *
	 * @default 'layout'
	 */
	layoutFileName?: string
	/**
	 * ⏳ Имя файла loading
	 *
	 * ▸ Файлы с этим именем используются как Suspense fallback
	 *
	 * ▸ Показываются во время загрузки страницы
	 *
	 * @default 'loading'
	 */
	loadingFileName?: string
	/**
	 * ❌ Имя файла not-found
	 *
	 * ▸ Файлы с этим именем используются для 404 страниц
	 *
	 * ▸ Показываются когда маршрут не найден
	 *
	 * @default 'not-found'
	 */
	notFoundFileName?: string
	/**
	 * ⚠️ Имя файла error
	 *
	 * ▸ Файлы с этим именем используются как ErrorBoundary
	 *
	 * ▸ Показываются при ошибке рендеринга
	 *
	 * @default 'error'
	 */
	errorFileName?: string
	/**
	 * 🎯 Расширения файлов
	 *
	 * ▸ Определяет типы файлов для обработки
	 *
	 * ▸ Поддерживает TypeScript, JSX, Vue и другие
	 *
	 * @example ['tsx', 'jsx']
	 * @example ['vue']
	 * @example ['tsx', 'mdx']
	 *
	 * @default ['tsx']
	 */
	extensions?: string[]
	/**
	 * 🌐 Базовый URL для SEO
	 *
	 * ▸ Используется для генерации sitemap.xml и robots.txt
	 *
	 * @example 'https://example.com'
	 * @example 'https://myapp.vercel.app'
	 *
	 * @default 'http://localhost:3000'
	 */
	baseUrl?: string
	/**
	 * 📍 Базовый путь для маршрутизации
	 *
	 * ▸ Используется для работы нескольких фронтендов на одном домене
	 *
	 * ▸ Устанавливает basename для React Router
	 *
	 * @example '/' - основной сайт
	 * @example '/admin' - админка на /admin/*
	 * @example '/app' - приложение на /app/*
	 *
	 * @default '/'
	 */
	basePath?: string
	/**
	 * 🚫 Пути для исключения из sitemap
	 *
	 * ▸ Список путей, которые не должны попадать в sitemap
	 *
	 * @example ['/admin', '/api', '/_internal']
	 *
	 * @default []
	 */
	disallowPaths?: string[]
	/**
	 * 🔧 Генерировать TypeScript типы
	 *
	 * ▸ Автоматическая генерация типов маршрутов
	 *
	 * @default true
	 */
	generateTypes?: boolean
	/**
	 * 📱 Включить SEO оптимизацию
	 *
	 * ▸ Генерация sitemap.xml, robots.txt и метаданных
	 *
	 * @default true
	 */
	enableSEO?: boolean
	/**
	 * 📱 Конфигурация breakpoints для адаптивных layouts
	 *
	 * ▸ Определяет условия для mobile-layout.tsx и pc-layout.tsx
	 *
	 * ▸ layout.tsx используется как fallback
	 *
	 * @example
	 * {
	 *   mobile: { max: 720 },
	 *   pc: { min: 1200 }
	 * }
	 *
	 * @default undefined (layouts не адаптивные)
	 */
	breakpoints?: {
		mobile?: {
			max?: number
		}
		pc?: {
			min?: number
		}
	}
}

export type ExportType = 'default' | 'named'

export type RouteEntry = {
	id: string
	path: string
	filePath: string
	loader: string
	exportType: ExportType
	layouts: string[]
	layoutsMobile?: string[]
	layoutsPC?: string[]
	loading?: string
	notFound?: string
	error?: string
}

export interface PageMetadata {
	title?: string
	description?: string
	keywords?: string[]
	author?: string
	changefreq?:
		| 'always'
		| 'hourly'
		| 'daily'
		| 'weekly'
		| 'monthly'
		| 'yearly'
		| 'never'
	priority?: number
}
