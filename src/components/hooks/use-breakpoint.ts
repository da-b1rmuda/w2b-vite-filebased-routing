import { useEffect, useState } from 'react'

export type BreakpointConfig = {
	mobile?: {
		max?: number
	}
	pc?: {
		min?: number
	}
}

export type BreakpointType = 'mobile' | 'pc' | 'default'

/**
 * Хук для определения текущего breakpoint на основе конфигурации
 * 
 * @param breakpoints Конфигурация breakpoints
 * @returns Текущий breakpoint: 'mobile', 'pc' или 'default'
 * 
 * @example
 * ```tsx
 * const breakpoint = useBreakpoint({
 *   mobile: { max: 720 },
 *   pc: { min: 1200 }
 * })
 * 
 * if (breakpoint === 'mobile') {
 *   // Мобильная версия
 * }
 * ```
 */
export function useBreakpoint(
	breakpoints?: BreakpointConfig
): BreakpointType {
	const [breakpoint, setBreakpoint] = useState<BreakpointType>('default')

	useEffect(() => {
		if (!breakpoints) {
			setBreakpoint('default')
			return
		}

		const checkBreakpoint = () => {
			const width = window.innerWidth

			// Проверяем mobile breakpoint
			if (breakpoints.mobile?.max && width <= breakpoints.mobile.max) {
				setBreakpoint('mobile')
				return
			}

			// Проверяем pc breakpoint
			if (breakpoints.pc?.min && width >= breakpoints.pc.min) {
				setBreakpoint('pc')
				return
			}

			// Fallback на default
			setBreakpoint('default')
		}

		checkBreakpoint()
		window.addEventListener('resize', checkBreakpoint)
		return () => window.removeEventListener('resize', checkBreakpoint)
	}, [breakpoints])

	return breakpoint
}
