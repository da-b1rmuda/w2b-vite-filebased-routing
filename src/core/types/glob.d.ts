// Type declarations for fast-glob module
declare module 'fast-glob' {
	interface Options {
		dot?: boolean
		absolute?: boolean
		cwd?: string
		ignore?: string[]
	}

	function fg(patterns: string | string[], options?: Options): Promise<string[]>
	export default fg
}
