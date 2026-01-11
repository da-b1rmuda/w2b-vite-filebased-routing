import {
	basePath as configBasePath,
	breakpoints as configBreakpoints,
	globalNotFound,
	manifest,
} from 'virtual:routes'
import { RouterLayout } from './router-layout'
import type { RouterProviderProps } from './types/types'

export default function RouterProvider({
	children,
	preloader,
	basePath,
	enableTransitions,
	transitionConfig,
	breakpoints,
}: Readonly<RouterProviderProps>) {
	// Используем basePath из пропсов, если указан, иначе из конфигурации
	const finalBasePath = basePath ?? configBasePath ?? '/'
	// Используем breakpoints из пропсов, если указаны, иначе из конфигурации
	const finalBreakpoints = breakpoints ?? configBreakpoints ?? undefined
	
	return (
		<RouterLayout
			manifest={manifest}
			preloader={preloader}
			basePath={finalBasePath}
			globalNotFound={globalNotFound}
			enableTransitions={enableTransitions}
			transitionConfig={transitionConfig}
			breakpoints={finalBreakpoints}
		>
			{children}
		</RouterLayout>
	)
}
