import { useSearchParams as useRouterSearchParams } from 'react-router-dom'

/**
 * Хук для работы с query параметрами URL
 * 
 * @returns Кортеж из [searchParams, setSearchParams]
 * 
 * @example
 * ```tsx
 * const [searchParams, setSearchParams] = useSearchParams()
 * const id = searchParams.get('id')
 * setSearchParams({ id: '123' })
 * ```
 */
export function useSearchParams() {
	return useRouterSearchParams()
}
