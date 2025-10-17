import fs from 'node:fs'
import type { ExportType } from './types/types'

export const slash = (p: string) => p.replace(/\\/g, '/')

export function detectExportType(filePath: string): ExportType {
	try {
		const content = fs.readFileSync(filePath, 'utf-8')

		// Проверяем наличие default экспорта
		const hasDefaultExport = /export\s+default\s+/.test(content)

		// Проверяем наличие любого именованного экспорта (функция, константа или класс)
		const hasNamedExport = /export\s+(const|function|class)\s+\w+\s*[=(]/.test(
			content
		)

		if (hasDefaultExport) {
			return 'default'
		} else if (hasNamedExport) {
			return 'named'
		}

		// По умолчанию предполагаем default экспорт для обратной совместимости
		return 'default'
	} catch (error) {
		// В случае ошибки чтения файла, предполагаем default экспорт
		console.warn(
			`[vite-plugin-file-router] Failed to read file ${filePath}:`,
			error
		)
		return 'default'
	}
}
