import { createRouteEntry } from './route-generator'
import { scanPages } from './scanner'
import type { Options } from './types/types'

export async function generateVirtualModuleCode(
	resolvedPagesDir: string,
	opts: Required<Options>
): Promise<string> {
	const pages = await scanPages(resolvedPagesDir, opts)
	const entries = pages.map(fp => {
		const entry = createRouteEntry(fp, resolvedPagesDir, opts)
		return `{
      id: ${JSON.stringify(entry.id)},
      path: ${JSON.stringify(entry.path)},
      filePath: ${JSON.stringify(entry.filePath)},
      loader: ${entry.loader},
      exportType: ${JSON.stringify(entry.exportType)},
      layouts: [${entry.layouts.join(',')}]
    }`
	})

	return `// Auto-generated routes manifest
const manifest = [${entries.join(',\n')}];

export { manifest };
export default manifest;
`
}
