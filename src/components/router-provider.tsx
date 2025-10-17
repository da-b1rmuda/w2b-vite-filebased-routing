import { manifest } from 'virtual:routes'
import { RouterLayout } from './router-layout'
import type { RouterProviderProps } from './types/types'

export default function RouterProvider({
	children,
	preloader,
}: Readonly<RouterProviderProps>) {
	return (
		<RouterLayout manifest={manifest} preloader={preloader}>
			{children}
		</RouterLayout>
	)
}
