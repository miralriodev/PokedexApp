// src/screens/Home/index.tsx
import React from 'react'
import { View, StyleSheet } from 'react-native'
import PokemonList from '../../src/components/PokemonList'

export const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <PokemonList />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
})
