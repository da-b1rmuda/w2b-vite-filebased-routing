import React from 'react'
import { BrowserRouter, Routes } from 'react-router-dom'
import { RouteTransition } from './route-transition'
import { renderManifestAsRoutes } from './router-utils'
import type { RouterLayoutProps } from './types/types'

export const RouterLayout = ({
	manifest,
	children,
	preloader,
	basePath = '/',
	globalNotFound,
	enableTransitions = false,
	transitionConfig,
}: RouterLayoutProps) => {
	const routes = renderManifestAsRoutes(manifest, globalNotFound)
	const routesElement = <Routes>{routes}</Routes>

	return (
		<BrowserRouter basename={basePath}>
			<React.Suspense fallback={children || preloader || <div>Loading...</div>}>
				{enableTransitions ? (
					<RouteTransition {...transitionConfig}>{routesElement}</RouteTransition>
				) : (
					routesElement
				)}
			</React.Suspense>
		</BrowserRouter>
	)
}
