import React from 'react'
import { BrowserRouter, Routes } from 'react-router-dom'
import { renderManifestAsRoutes } from './router-utils'
import type { RouterLayoutProps } from './types/types'

export const RouterLayout = ({
	manifest,
	children,
	preloader,
	basePath = '/',
	globalNotFound,
}: RouterLayoutProps) => (
	<BrowserRouter basename={basePath}>
		<React.Suspense fallback={children || preloader || <div>Loading...</div>}>
			<Routes>{renderManifestAsRoutes(manifest, globalNotFound)}</Routes>
		</React.Suspense>
	</BrowserRouter>
)
