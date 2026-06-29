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
import type { Project, UserSubmission } from '../types';

const FAVORITES_KEY = '@arduinolab:favorites';

interface AppContextValue {
  projects: Project[];
  favorites: string[];
  submissions: UserSubmission[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  addSubmission: (data: Omit<UserSubmission, 'id' | 'status' | 'submittedAt'>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY)
      .then((raw) => { if (raw) setFavorites(JSON.parse(raw) as string[]); })
      .catch(() => {});
  }, []);

  const persistFavorites = (ids: string[]) => {
    AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids)).catch(() => {});
  };

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

  return (
    <AppContext.Provider
      value={{ projects: mockProjects, favorites, submissions, isFavorite, toggleFavorite, addSubmission }}
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
