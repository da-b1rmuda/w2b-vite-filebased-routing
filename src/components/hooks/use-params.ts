import { useParams as useRouterParams } from 'react-router-dom'

export type Params = Record<string, string | undefined>

/**
 * Хук для получения параметров маршрута
 * 
 * @returns Объект с параметрами текущего маршрута
 * 
 * @example
 * ```tsx
 * // Для маршрута /users/:id
 * const { id } = useParams()
 * ```
 */
export function useParams<T extends Params = Params>(): T {
	return useRouterParams() as T
}
