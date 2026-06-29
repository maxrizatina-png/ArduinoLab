import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockProjects } from '../data/mockProjects';
import { lightColors, darkColors, type ThemeMode } from '../constants/theme';
import type { Project, UserSubmission } from '../types';

const FAVORITES_KEY = '@arduinolab:favorites';
const THEME_KEY = '@arduinolab:theme';

interface AppContextValue {
  projects: Project[];
  favorites: string[];
  submissions: UserSubmission[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  addSubmission: (data: Omit<UserSubmission, 'id' | 'status' | 'submittedAt'>) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  colors: typeof lightColors;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');

  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY)
      .then((raw) => { if (raw) setFavorites(JSON.parse(raw) as string[]); })
      .catch(() => {});
    AsyncStorage.getItem(THEME_KEY)
      .then((raw) => { if (raw === 'dark' || raw === 'light') setThemeModeState(raw); })
      .catch(() => {});
  }, []);

  const persistFavorites = (ids: string[]) => {
    AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids)).catch(() => {});
  };

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_KEY, mode).catch(() => {});
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      persistFavorites(next);
      return next;
    });
  }, []);

  const addSubmission = useCallback(
    (data: Omit<UserSubmission, 'id' | 'status' | 'submittedAt'>) => {
      const entry: UserSubmission = {
        ...data,
        id: String(Date.now()),
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };
      setSubmissions((prev) => [entry, ...prev]);
    },
    [],
  );

  const colors = themeMode === 'dark' ? darkColors : lightColors;

  return (
    <AppContext.Provider
      value={{ projects: mockProjects, favorites, submissions, isFavorite, toggleFavorite, addSubmission, themeMode, setThemeMode, colors }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
