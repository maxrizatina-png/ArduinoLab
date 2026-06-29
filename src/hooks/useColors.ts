import { useApp } from '../context/AppContext';

export function useColors() {
  return useApp().colors;
}
