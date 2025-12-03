import React from 'react'
import { DetailLayout } from './layout'
import { usePokemonDetailController } from './controller'

export const DetailScreen: React.FC = () => {
  const props = usePokemonDetailController()
  return <DetailLayout {...props} />
}

