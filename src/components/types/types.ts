import React from 'react'

export type LayoutComponent = React.ComponentType<{
	children?: React.ReactNode
}>

export type Node = {
	id: string
	path: string
	loader: () => Promise<Record<string, unknown>>
	exportType?: 'default' | 'named'
	layouts?: Array<
		() => Promise<{ default: LayoutComponent } | { Layout: LayoutComponent }>
	>
	layoutsMobile?: Array<
		() => Promise<{ default: LayoutComponent } | { Layout: LayoutComponent }>
	>
	layoutsPC?: Array<
		() => Promise<{ default: LayoutComponent } | { Layout: LayoutComponent }>
	>
	loading?: () => Promise<{ default: React.ComponentType }>
	notFound?: () => Promise<{ default: React.ComponentType }>
	error?: () => Promise<{ default: React.ComponentType<{ error?: Error; resetError?: () => void }> }>
}

export type RouterLayoutProps = {
	manifest: Node[]
	children?: React.ReactNode
	preloader?: React.ReactNode
	basePath?: string
	globalNotFound?: () => Promise<{ default: React.ComponentType }>
	enableTransitions?: boolean
	transitionConfig?: {
		enterClass?: string
		enterActiveClass?: string
		exitClass?: string
		exitActiveClass?: string
		duration?: number
		mode?: 'fade' | 'slide' | 'custom'
		onTransition?: (direction: 'enter' | 'exit') => void
	}
	breakpoints?: {
		mobile?: {
			max?: number
		}
		pc?: {
			min?: number
		}
	}
}

export type RouterProviderProps = {
	/**
	 * ⏳ Кастомный индикатор загрузки
	 *
	 * ▸ Компонент который показывается во время загрузки
	 *
	 * ▸ Если не указан - используется стандартный прелоадер
	 *
	 * @default
	 * <div>Loading...</div>
	 */
	preloader?: React.ReactNode
	/**
	 * 📍 Базовый путь для маршрутизации
	 *
	 * ▸ Используется для работы нескольких фронтендов на одном домене
	 *
	 * ▸ Переопределяет basePath из конфигурации плагина
	 *
	 * @example '/' - основной сайт
	 * @example '/admin' - админка на /admin/*
	 * @example '/app' - приложение на /app/*
	 *
	 * @default '/'
	 */
	basePath?: string
	/**
	 * 🎬 Включить анимации переходов между страницами
	 *
	 * ▸ Если true, страницы будут анимироваться при переключении
	 *
	 * ▸ Можно настроить через transitionConfig
	 *
	 * @default false
	 */
	enableTransitions?: boolean
	/**
	 * ⚙️ Конфигурация анимаций переходов
	 *
	 * ▸ Настройка CSS классов и параметров анимации
	 *
	 * ▸ Если не указано, используются значения по умолчанию
	 */
	transitionConfig?: {
		enterClass?: string
		enterActiveClass?: string
		exitClass?: string
		exitActiveClass?: string
		duration?: number
		mode?: 'fade' | 'slide' | 'custom'
		onTransition?: (direction: 'enter' | 'exit') => void
	}
	/**
	 * 📱 Конфигурация breakpoints для адаптивных layouts
	 *
	 * ▸ Переопределяет breakpoints из конфигурации плагина
	 *
	 * ▸ Используется для выбора mobile-layout.tsx или pc-layout.tsx
	 *
	 * @example
	 * {
	 *   mobile: { max: 720 },
	 *   pc: { min: 1200 }
	 * }
	 */
	breakpoints?: {
		mobile?: {
			max?: number
		}
		pc?: {
			min?: number
		}
	}
	children?: React.ReactNode
}
