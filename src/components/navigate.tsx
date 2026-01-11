import type { NavigateProps as ReactRouterNavigateProps } from 'react-router-dom'
import { Navigate as ReactRouterNavigate } from 'react-router-dom'

export type NavigateProps = ReactRouterNavigateProps

/**
 * Компонент для программного редиректа
 * 
 * @example
 * ```tsx
 * <Navigate to="/login" replace />
 * <Navigate to="/dashboard" state={{ from: location }} />
 * ```
 */
export const Navigate = ReactRouterNavigate
