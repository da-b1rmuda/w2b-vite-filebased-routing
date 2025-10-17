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
	children?: React.ReactNode
}
