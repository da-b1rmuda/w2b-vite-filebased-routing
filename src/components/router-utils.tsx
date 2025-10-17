import React from 'react'
import { Route } from 'react-router-dom'
import type { Node } from './types/types'

function wrapLayouts(
	layouts: Node['layouts'] | undefined,
	pageEl: React.ReactNode
) {
	if (!layouts || layouts.length === 0) return pageEl

	return layouts.reduceRight((child, loader) => {
		const Layout = React.lazy(async () => {
			const module = await loader()
			// Поддерживаем как default, так и именованный экспорт Layout
			return 'default' in module ? module : { default: module.Layout }
		})
		return <Layout>{child}</Layout>
	}, pageEl as React.ReactElement)
}

export const renderManifestAsRoutes = (manifest: Node[]) => {
	return manifest.map(n => {
		const Page = React.lazy(async () => {
			const module = await n.loader()

			// Если есть default экспорт, используем его
			if (
				module &&
				typeof module === 'object' &&
				'default' in module &&
				module.default
			) {
				return module as { default: React.ComponentType }
			}

			// Ищем любой именованный экспорт, который является функцией или компонентом
			if (module && typeof module === 'object') {
				const namedExports = Object.keys(module).filter(
					key => key !== 'default'
				)
				for (const key of namedExports) {
					const exportValue = module[key]
					if (
						typeof exportValue === 'function' ||
						(typeof exportValue === 'object' && exportValue !== null)
					) {
						return {
							default: exportValue as React.ComponentType,
						}
					}
				}
			}

			// Если ничего не найдено, возвращаем ошибку
			const availableExports =
				module && typeof module === 'object'
					? Object.keys(module).join(', ')
					: 'unknown'
			throw new Error(
				`No valid export found in module for route ${n.path}. Available exports: ${availableExports}`
			)
		})

		const element = wrapLayouts(n.layouts, <Page />)
		return <Route key={n.id} path={n.path} element={element} />
	})
}
