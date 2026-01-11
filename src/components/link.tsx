import type { LinkProps as ReactRouterLinkProps } from 'react-router-dom'
import { Link as ReactRouterLink } from 'react-router-dom'

export type LinkProps = ReactRouterLinkProps

/**
 * Компонент для навигационных ссылок
 * 
 * Используется для клиентской навигации без перезагрузки страницы
 * 
 * @example
 * ```tsx
 * <Link to="/about">About</Link>
 * <Link to="/users/123" state={{ from: 'home' }}>User Profile</Link>
 * ```
 */
export const Link = ReactRouterLink

export { useLink } from './hooks/use-links'
