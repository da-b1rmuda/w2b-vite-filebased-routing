import fs from 'node:fs'

export function createHMRHandlers(
	resolvedPagesDir: string,
	resolvedVirtualId: string,
	root: string
) {
	const configureServer = (srv: any) => {
		const invalidateVirtual = async () => {
			const mod = srv.moduleGraph?.getModuleById?.(resolvedVirtualId)
			if (mod) {
				srv.moduleGraph?.invalidateModule?.(mod)
			}
		}

		const watchPath = fs.existsSync(resolvedPagesDir) ? resolvedPagesDir : root
		srv.watcher?.add?.(watchPath)

		srv.watcher?.on?.('add', (p: string) => {
			if (p.startsWith(resolvedPagesDir)) invalidateVirtual()
		})
		srv.watcher?.on?.('unlink', (p: string) => {
			if (p.startsWith(resolvedPagesDir)) invalidateVirtual()
		})
	}

	const handleHotUpdate = (ctx: any) => {
		const f = ctx.file
		if (!f?.startsWith(resolvedPagesDir)) return

		const mod = ctx.server.moduleGraph?.getModuleById?.(resolvedVirtualId)
		if (mod) {
			ctx.server.moduleGraph?.invalidateModule?.(mod)
			return [mod]
		}
	}

	return { configureServer, handleHotUpdate }
}
