import React from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
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
  })

  const typeQuery = useQuery<Pokemon[], Error>({
    queryKey: ['pokemonType', typeFilter],
    queryFn: () => fetchPokemonByType(typeFilter as string),
    enabled: !!typeFilter,
    networkMode: 'offlineFirst',
    staleTime: 1000 * 60 * 30,
  })

  const searchQuery = useQuery<Pokemon[], Error>({
    queryKey: ['pokemonSearch', debounced],
    queryFn: () => fetchPokemonByName(debounced),
    enabled: !!debounced,
    networkMode: 'offlineFirst',
    staleTime: 1000 * 60 * 30,
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
