import { useQuery } from '@tanstack/react-query'
import { useRoute, RouteProp } from '@react-navigation/native'
import { MMKV } from 'react-native-mmkv'
import { fetchPokemonDetail, PokemonDetail } from './fetchs'

type RootStackParamList = { Detail: { name: string } }

const storage = new MMKV()
const cacheKey = (name: string) => `pokemon:${name}`

function readCached(name: string): PokemonDetail | undefined {
  const raw = storage.getString(cacheKey(name))
  return raw ? (JSON.parse(raw) as PokemonDetail) : undefined
}

function writeCached(name: string, detail: PokemonDetail) {
  storage.set(cacheKey(name), JSON.stringify(detail))
}

export function usePokemonDetailController(): {
  name: string
  pokemon: PokemonDetail | undefined
  isLoading: boolean
  refetch: () => void
} {
  const route = useRoute<RouteProp<RootStackParamList, 'Detail'>>()
  const name = route.params?.name

  const initial = name ? readCached(name) : undefined

  const query = useQuery<PokemonDetail, Error>({
    queryKey: ['pokemonDetail', name],
    queryFn: async () => {
      const detail = await fetchPokemonDetail(name)
      writeCached(name, detail)
      return detail
    },
    enabled: !!name,
    initialData: initial,
    networkMode: 'offlineFirst',
    staleTime: 1000 * 60 * 30,
  })

  return {
    name: name ?? '',
    pokemon: query.data,
    isLoading: query.isLoading,
    refetch: () => query.refetch(),
  }
}

