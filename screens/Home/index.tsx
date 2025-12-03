// src/screens/Home/index.tsx
import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import PokemonList from '../../src/components/PokemonList'

export const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <PokemonList />
    </SafeAreaView>
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
