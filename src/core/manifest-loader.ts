import fs from 'node:fs'
import path from 'node:path'

export async function loadGeneratedManifest(root: string): Promise<string> {
	const manifestPath = path.join(root, 'dist', 'routes-manifest.js')
	if (fs.existsSync(manifestPath)) {
		try {
			const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
			const manifestRegex = /export const manifest = \[.*?\];/s
			const manifestMatch = manifestRegex.exec(manifestContent)
			if (manifestMatch) {
				return `// virtual routes (production mode - using generated manifest)
${manifestMatch[0]}
export default manifest;
`
			}
		} catch (error) {
			console.warn(
				'[vite-plugin-file-router] Failed to load generated manifest:',
				error
			)
		}
	}

	// Fallback - пустой манифест
	return `// virtual routes (production mode - empty manifest)
export const manifest = [];
export default manifest;
`
}
