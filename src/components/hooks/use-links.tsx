import { useLocation } from './use-location'

export function useLink(props: { href: string }) {
  const location = useLocation()
  const currentPath = location.pathname
  
  return {
    href: props.href,
    isActive: currentPath === props.href,
  }
}