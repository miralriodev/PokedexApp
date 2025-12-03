import axios from 'axios'

export interface Pokemon {
  name: string
  url: string
}

export interface PokemonDetail {
  name: string
  sprites?: {
    front_default?: string
    other?: {
      ['official-artwork']?: {
        front_default?: string
      }
    }
  }
  stats?: { stat: { name: string }; base_stat: number }[]
  types?: { type: { name: string } }[]
  abilities?: { ability: { name: string } }[]
}

const client = axios.create({ baseURL: 'https://pokeapi.co/api/v2/' })

export async function fetchPokemonDetail(name: string): Promise<PokemonDetail> {
  const { data } = await client.get<PokemonDetail>(`/pokemon/${name}`)
  return data
}

