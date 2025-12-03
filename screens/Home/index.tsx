// src/screens/Home/index.tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Home Screen - Pokémon List Here</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

