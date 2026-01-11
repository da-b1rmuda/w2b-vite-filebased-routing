import React from 'react'
import { Route } from 'react-router-dom'
import { ErrorBoundary } from './error-boundary'
import { useBreakpoint } from './hooks/use-breakpoint'
import type { Node } from './types/types'
import type { BreakpointConfig } from './hooks/use-breakpoint'

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

function AdaptiveLayoutWrapper({
	layouts,
	layoutsMobile,
	layoutsPC,
	pageEl,
	breakpoints,
}: {
	layouts: Node['layouts'] | undefined
	layoutsMobile: Node['layoutsMobile'] | undefined
	layoutsPC: Node['layoutsPC'] | undefined
	pageEl: React.ReactNode
	breakpoints?: BreakpointConfig
}) {
	const breakpoint = useBreakpoint(breakpoints)
	
	// Выбираем layouts в зависимости от breakpoint
	let activeLayouts = layouts
	
	if (breakpoint === 'mobile' && layoutsMobile && layoutsMobile.length > 0) {
		activeLayouts = layoutsMobile
	} else if (breakpoint === 'pc' && layoutsPC && layoutsPC.length > 0) {
		activeLayouts = layoutsPC
	}
	// Если breakpoint === 'default' или нет адаптивных layouts, используем обычные layouts
	
	return <>{wrapLayouts(activeLayouts, pageEl)}</>
}

function createLoadingFallback(loadingLoader?: () => Promise<{ default: React.ComponentType }>) {
	if (!loadingLoader) return undefined
	
	// Loading компонент lazy, но он используется как fallback в Suspense
	const Loading = React.lazy(loadingLoader)
	return <Loading />
}

function createErrorFallback(errorLoader?: () => Promise<{ default: React.ComponentType<{ error?: Error; resetError?: () => void }> }>) {
	if (!errorLoader) return undefined
	
	const ErrorComponent = React.lazy(errorLoader)
	return (props: { error?: Error; resetError?: () => void }) => <ErrorComponent {...props} />
}

export const renderManifestAsRoutes = (
	manifest: Node[],
	globalNotFound?: () => Promise<{ default: React.ComponentType }>,
	breakpoints?: BreakpointConfig
) => {
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

		const loadingFallback = createLoadingFallback(n.loading)
		const errorFallback = createErrorFallback(n.error)
		
		// Используем адаптивные layouts если они есть и breakpoints настроены
		const pageElement = breakpoints && (n.layoutsMobile || n.layoutsPC) ? (
			<AdaptiveLayoutWrapper
				layouts={n.layouts}
				layoutsMobile={n.layoutsMobile}
				layoutsPC={n.layoutsPC}
				pageEl={<Page />}
				breakpoints={breakpoints}
			/>
		) : (
			wrapLayouts(n.layouts, <Page />)
		)
		
		// Оборачиваем в ErrorBoundary если есть error компонент
		const wrappedElement = errorFallback ? (
			<ErrorBoundary fallback={errorFallback}>
				{pageElement}
			</ErrorBoundary>
		) : pageElement

		// Оборачиваем в Suspense с loading fallback
		const element = loadingFallback ? (
			<React.Suspense fallback={loadingFallback}>
				{wrappedElement}
			</React.Suspense>
		) : (
			<React.Suspense fallback={<div>Loading...</div>}>
				{wrappedElement}
			</React.Suspense>
		)

		return <Route key={n.id} path={n.path} element={element} />
	}).concat(
		// Добавляем 404 маршрут в конец
		globalNotFound ? (
			<Route
				key="__not_found__"
				path="*"
				element={
					<React.Suspense fallback={<div>Loading...</div>}>
						{(() => {
							const NotFound = React.lazy(globalNotFound)
							return <NotFound />
						})()}
					</React.Suspense>
				}
			/>
		) : (
			<Route
				key="__not_found__"
				path="*"
				element={
					<div style={{ padding: '20px', textAlign: 'center' }}>
						<h1>404</h1>
						<p>Page not found</p>
					</div>
				}
			/>
		)
	)
}
