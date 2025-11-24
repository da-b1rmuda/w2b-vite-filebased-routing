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
}

export type RouterLayoutProps = {
	manifest: Node[]
	children?: React.ReactNode
	preloader?: React.ReactNode
	basePath?: string
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
	children?: React.ReactNode
}
