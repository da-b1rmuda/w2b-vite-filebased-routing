import { useLocation as useRouterLocation } from 'react-router-dom'
import type { Location as RouterLocation } from 'react-router-dom'

/**
 * Тип локации с информацией о текущем маршруте
 */
export type Location = RouterLocation

/**
 * Хук для получения текущей локации
 * 
 * @returns Объект с информацией о текущем маршруте
 * 
 * @example
 * ```tsx
 * const location = useLocation()
 * console.log(location.pathname) // '/about'
 * console.log(location.search) // '?id=123'
 * ```
 */
export function useLocation(): Location {
	return useRouterLocation()
}
