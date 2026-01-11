import { useNavigate as useRouterNavigate } from 'react-router-dom'

export type NavigateOptions = {
	replace?: boolean
	state?: unknown
	relative?: 'route' | 'path'
}

export type To = string | number | { pathname?: string; search?: string; hash?: string }

/**
 * Хук для программной навигации
 * 
 * @returns Функция для навигации
 * 
 * @example
 * ```tsx
 * const navigate = useNavigate()
 * navigate('/about')
 * navigate('/users', { replace: true })
 * navigate(-1) // назад
 * ```
 */
export function useNavigate() {
	return useRouterNavigate()
}
