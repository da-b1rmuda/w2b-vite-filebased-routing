import React from 'react'

export interface ErrorBoundaryProps {
	children: React.ReactNode
	fallback?: React.ComponentType<{ error?: Error; resetError?: () => void }>
	onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
	hasError: boolean
	error: Error | null
}

/**
 * ErrorBoundary компонент для обработки ошибок рендеринга
 */
export class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = { hasError: false, error: null }
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		this.props.onError?.(error, errorInfo)
	}

	resetError = () => {
		this.setState({ hasError: false, error: null })
	}

	render() {
		if (this.state.hasError && this.state.error) {
			if (this.props.fallback) {
				const Fallback = this.props.fallback
				return <Fallback error={this.state.error} resetError={this.resetError} />
			}
			return (
				<div style={{ padding: '20px' }}>
					<h2>Something went wrong</h2>
					<pre>{this.state.error.message}</pre>
					<button onClick={this.resetError}>Try again</button>
				</div>
			)
		}

		return this.props.children
	}
}
