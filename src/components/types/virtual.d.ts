// Type declarations for virtual:routes module
declare module 'virtual:routes' {
	interface RouteNode {
		id: string
		path: string
		filePath: string
		loader: () => Promise<Record<string, unknown>>
		exportType?: 'default' | 'named'
		layouts?: Array<() => Promise<{ default: any } | { Layout: any }>>
		loading?: () => Promise<{ default: React.ComponentType }>
		notFound?: () => Promise<{ default: React.ComponentType }>
		error?: () => Promise<{ default: React.ComponentType<{ error?: Error; resetError?: () => void }> }>
	}

	export const manifest: RouteNode[]
	export const basePath: string
	export const globalNotFound?: () => Promise<{ default: React.ComponentType }>
	const defaultExport: RouteNode[]
	export default defaultExport
}
