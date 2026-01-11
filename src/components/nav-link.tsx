import type { NavLinkProps as ReactRouterNavLinkProps } from 'react-router-dom'
import { NavLink as ReactRouterNavLink } from 'react-router-dom'

export type NavLinkProps = ReactRouterNavLinkProps

/**
 * Компонент для навигационных ссылок с поддержкой активного состояния
 * 
 * Автоматически добавляет класс 'active' когда маршрут активен
 * 
 * @example
 * ```tsx
 * <NavLink to="/about">About</NavLink>
 * <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}>
 *   Users
 * </NavLink>
 * ```
 */
export const NavLink = ReactRouterNavLink
