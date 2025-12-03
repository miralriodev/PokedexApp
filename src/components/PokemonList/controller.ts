import React from 'react'
import { useInfiniteQuery, useQuery, InfiniteData } from '@tanstack/react-query'
import { MMKV } from 'react-native-mmkv'
import { fetchPokemonPage, fetchPokemonByType, fetchPokemonByName, Pokemon, PokemonPage } from './fetchs'

function parseNextOffset(next: string | null, fallback: number): number | undefined {
  if (!next) return undefined
  const match = next.match(/[?&]offset=(\d+)/)
  return match ? Number(match[1]) : fallback
}

export function usePokemonList(): {
  pokemonData: Pokemon[]
  isLoading: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  searchTerm: string
  setSearchTerm: (v: string) => void
  typeFilter: string | null
  setTypeFilter: (v: string | null) => void
} {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<string | null>(null)

  const [debounced, setDebounced] = React.useState(searchTerm)
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(searchTerm.trim().toLowerCase()), 300)
    return () => clearTimeout(t)
  }, [searchTerm])

  const storage = React.useMemo(() => new MMKV(), [])
  const listKey = 'pokemon:list'
  const typeKey = (t: string) => `pokemon:type:${t}`
  const searchKey = (s: string) => `pokemon:search:${s}`

  const initialListRaw = storage.getString(listKey)
  const initialList: InfiniteData<PokemonPage> | undefined = initialListRaw
    ? (JSON.parse(initialListRaw) as InfiniteData<PokemonPage>)
    : undefined

  const query = useInfiniteQuery<PokemonPage, Error>({
    queryKey: ['pokemonList'],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchPokemonPage(pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      const fallback = allPages.length * 20
      return parseNextOffset(lastPage.next, fallback)
    },
    networkMode: 'offlineFirst',
    staleTime: 1000 * 60 * 30,
    initialData: initialList,
    onSuccess: data => {
      storage.set(listKey, JSON.stringify(data))
    },
  })

  const typeQuery = useQuery<Pokemon[], Error>({
    queryKey: ['pokemonType', typeFilter],
    queryFn: () => fetchPokemonByType(typeFilter as string),
    enabled: !!typeFilter,
    networkMode: 'offlineFirst',
    staleTime: 1000 * 60 * 30,
    initialData: typeFilter ? (() => {
      const raw = storage.getString(typeKey(typeFilter))
      return raw ? (JSON.parse(raw) as Pokemon[]) : undefined
    })() : undefined,
    onSuccess: data => {
      if (typeFilter) storage.set(typeKey(typeFilter), JSON.stringify(data))
    },
  })

  const searchQuery = useQuery<Pokemon[], Error>({
    queryKey: ['pokemonSearch', debounced],
    queryFn: () => fetchPokemonByName(debounced),
    enabled: !!debounced,
    networkMode: 'offlineFirst',
    staleTime: 1000 * 60 * 30,
    initialData: debounced ? (() => {
      const raw = storage.getString(searchKey(debounced))
      return raw ? (JSON.parse(raw) as Pokemon[]) : undefined
    })() : undefined,
    onSuccess: data => {
      if (debounced) storage.set(searchKey(debounced), JSON.stringify(data))
    },
  })

  const pokemonData = React.useMemo(() => {
    if (debounced) return searchQuery.data ?? []
    if (typeFilter) return typeQuery.data ?? []
    return (query.data?.pages ?? []).flatMap(p => p.results)
  }, [debounced, searchQuery.data, typeFilter, typeQuery.data, query.data])

  return {
    pokemonData,
    isLoading: query.isLoading || typeQuery.isLoading || searchQuery.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: () => query.fetchNextPage(),
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
  }
}
