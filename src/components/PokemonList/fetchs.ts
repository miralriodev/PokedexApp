import axios from 'axios'

export interface Pokemon {
  name: string
  url: string
}

export interface PokemonPage {
  next: string | null
  results: Pokemon[]
}

const client = axios.create({ baseURL: 'https://pokeapi.co/api/v2/' })

export async function fetchPokemonPage(offset: number): Promise<PokemonPage> {
  const { data } = await client.get<PokemonPage>(`/pokemon?offset=${offset}`)
  return data
}

export async function fetchPokemonByType(typeName: string): Promise<Pokemon[]> {
  const { data } = await client.get<{ pokemon: { pokemon: Pokemon }[] }>(`/type/${typeName}`)
  return data.pokemon.map(p => p.pokemon)
}

export async function fetchPokemonByName(name: string): Promise<Pokemon[]> {
  const { data } = await client.get<{ name: string }>(`/pokemon/${name}`)
  return [{ name: data.name, url: `https://pokeapi.co/api/v2/pokemon/${data.name}` }]
}
