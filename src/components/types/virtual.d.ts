// Type declarations for virtual:routes module
declare module 'virtual:routes' {
	interface RouteNode {
		id: string
		path: string
		filePath: string
		loader: () => Promise<Record<string, unknown>>
		exportType?: 'default' | 'named'
		layouts?: Array<() => Promise<{ default: any } | { Layout: any }>>
	}

	export const manifest: RouteNode[]
	const defaultExport: RouteNode[]
	export default defaultExport
}
