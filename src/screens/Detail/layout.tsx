import React from 'react'
import { ActivityIndicator, ScrollView, Text, View, TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import { styles } from './styles'
import useFavorites from '../../store/useFavorites'
import type { PokemonDetail } from './fetchs'

type Props = {
  name: string
  pokemon: PokemonDetail | undefined
  isLoading: boolean
  refetch: () => void
}

export function DetailLayout({ name, pokemon, isLoading }: Props) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const favorite = isFavorite(name)

  if (isLoading && !pokemon) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    )
  }

  const imageUri =
    pokemon?.sprites?.other?.['official-artwork']?.front_default ??
    pokemon?.sprites?.front_default

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {imageUri ? (
          <FastImage style={styles.image} source={{ uri: imageUri }} resizeMode={FastImage.resizeMode.contain} />
        ) : (
          <View style={[styles.image, { alignItems: 'center', justifyContent: 'center' }]}>
            <Text>Sin imagen</Text>
          </View>
        )}
        <View style={styles.titleRow}>
          <Text style={styles.title}>{name}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(name)} accessibilityRole="button" accessibilityLabel={`Favorito ${name}`}>
            <Text style={styles.heart}>{favorite ? '♥' : '♡'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipos</Text>
        <View style={styles.pillRow}>
          {(pokemon?.types ?? []).map(t => (
            <View key={t.type.name} style={styles.pill}>
              <Text style={styles.pillText}>{t.type.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habilidades</Text>
        <View style={styles.pillRow}>
          {(pokemon?.abilities ?? []).map(a => (
            <View key={a.ability.name} style={styles.pill}>
              <Text style={styles.pillText}>{a.ability.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas</Text>
        {(pokemon?.stats ?? []).map(s => (
          <View key={s.stat.name} style={styles.statRow}>
            <Text style={styles.pillText}>{s.stat.name}</Text>
            <Text>{s.base_stat}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

