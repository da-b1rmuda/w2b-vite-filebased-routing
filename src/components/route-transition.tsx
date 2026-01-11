import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from './hooks/use-location'

export interface RouteTransitionProps {
	children: React.ReactNode
	/**
	 * CSS класс для анимации входа
	 * @default 'route-enter'
	 */
	enterClass?: string
	/**
	 * CSS класс для активного состояния (после входа)
	 * @default 'route-enter-active'
	 */
	enterActiveClass?: string
	/**
	 * CSS класс для анимации выхода
	 * @default 'route-exit'
	 */
	exitClass?: string
	/**
	 * CSS класс для активного состояния выхода
	 * @default 'route-exit-active'
	 */
	exitActiveClass?: string
	/**
	 * Длительность анимации в миллисекундах
	 * @default 300
	 */
	duration?: number
	/**
	 * Кастомная функция для анимации
	 */
	onTransition?: (direction: 'enter' | 'exit') => void
	/**
	 * Режим анимации: 'fade', 'slide', 'custom'
	 * @default 'fade'
	 */
	mode?: 'fade' | 'slide' | 'custom'
}

export function RouteTransition({
	children,
	enterClass = 'route-enter',
	enterActiveClass = 'route-enter-active',
	exitClass = 'route-exit',
	exitActiveClass = 'route-exit-active',
	duration = 300,
	onTransition,
	mode = 'fade',
}: RouteTransitionProps) {
	const location = useLocation()
	const [displayChildren, setDisplayChildren] = useState(children)
	const [isExiting, setIsExiting] = useState(false)
	const [isEntering, setIsEntering] = useState(false)
	const prevLocationRef = useRef(location.pathname)
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		if (prevLocationRef.current !== location.pathname) {
			// Очищаем предыдущий таймер если есть
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}

			// Начинаем анимацию выхода
			setIsExiting(true)
			setIsEntering(false)
			onTransition?.('exit')

			timeoutRef.current = setTimeout(() => {
				// Меняем контент
				setDisplayChildren(children)
				setIsExiting(false)
				setIsEntering(true)
				onTransition?.('enter')

				// Начинаем анимацию входа
				timeoutRef.current = setTimeout(() => {
					setIsEntering(false)
					timeoutRef.current = null
				}, duration)
			}, duration)

			prevLocationRef.current = location.pathname
		} else {
			// Если location не изменился, просто обновляем children
			setDisplayChildren(children)
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
				timeoutRef.current = null
			}
		}
	}, [location.pathname, children, duration, onTransition])

	// Определяем классы в зависимости от состояния
	const getClassName = () => {
		if (isExiting) {
			return `${exitClass} ${exitActiveClass}`
		}
		if (isEntering) {
			return `${enterClass} ${enterActiveClass}`
		}
		return ''
	}

	// Стили для режима fade (по умолчанию)
	const getDefaultStyles = () => {
		if (mode === 'fade') {
			return {
				transition: `opacity ${duration}ms ease-in-out`,
				opacity: isExiting ? 0 : isEntering ? 0 : 1,
			}
		}
		if (mode === 'slide') {
			return {
				transition: `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,
				transform: isExiting
					? 'translateX(-100%)'
					: isEntering
						? 'translateX(100%)'
						: 'translateX(0)',
				opacity: isExiting ? 0 : isEntering ? 0 : 1,
			}
		}
		return {}
	}

	return (
		<div className={getClassName()} style={getDefaultStyles()}>
			{displayChildren}
		</div>
	)
}
