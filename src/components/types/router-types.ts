// Реэкспорт типов из react-router-dom для удобства пользователей
// Пользователи не должны импортировать react-router-dom напрямую
// Эти типы используются только для типизации, runtime зависимость отсутствует
export type {
	LinkProps,
	NavigateOptions,
	NavigateProps,
	NavLinkProps,
	To,
} from 'react-router-dom'

// Location экспортируется из хука useLocation
export type { Location } from '../hooks/use-location'

// Params экспортируется из хука useParams
export type { Params } from '../hooks/use-params'
