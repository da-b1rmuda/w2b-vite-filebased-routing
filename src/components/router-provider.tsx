import {
	basePath as configBasePath,
	globalNotFound,
	manifest,
} from 'virtual:routes'
import { RouterLayout } from './router-layout'
import type { RouterProviderProps } from './types/types'

export default function RouterProvider({
	children,
	preloader,
	basePath,
}: Readonly<RouterProviderProps>) {
	// Используем basePath из пропсов, если указан, иначе из конфигурации
	const finalBasePath = basePath ?? configBasePath ?? '/'
	
	return (
		<RouterLayout
			manifest={manifest}
			preloader={preloader}
			basePath={finalBasePath}
			globalNotFound={globalNotFound}
		>
			{children}
		</RouterLayout>
	)
}
