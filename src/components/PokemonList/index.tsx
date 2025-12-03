import React from 'react'
import { PokemonListLayout } from './layout'
import { usePokemonList } from './controller'

export default function PokemonList() {
  const props = usePokemonList()
  return <PokemonListLayout {...props} />
}

