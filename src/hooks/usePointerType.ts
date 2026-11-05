import { useMediaQuery } from './useMediaQuery'
export function usePointerType() {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}
