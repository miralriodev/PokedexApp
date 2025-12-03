import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MMKV } from 'react-native-mmkv'
import type { Pokemon } from '../components/PokemonList/fetchs'

type FavoritesState = {
  favorites: string[]
  toggleFavorite: (name: string) => void
  isFavorite: (name: string) => boolean
  isPokemonFavorite: (pokemon: Pokemon) => boolean
}

const storage = new MMKV()

const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (name: string) => {
        const current = get().favorites
        const exists = current.includes(name)
        const next = exists ? current.filter(n => n !== name) : [...current, name]
        set({ favorites: next })
      },
      isFavorite: (name: string) => get().favorites.includes(name),
      isPokemonFavorite: (pokemon: Pokemon) => get().favorites.includes(pokemon.name),
    }),
    {
      name: 'favorites',
      storage: createJSONStorage(() => ({
        getItem: key => storage.getString(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
        removeItem: key => storage.delete(key),
      })),
      partialize: state => ({ favorites: state.favorites }),
    }
  )
)

export default useFavorites

