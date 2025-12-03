import React from 'react'
import { ActivityIndicator, FlatList, Text, View, TouchableOpacity, TextInput } from 'react-native'
import { useNavigation, NavigationProp } from '@react-navigation/native'
import { styles } from './styles'
import { Pokemon } from './fetchs'

type Props = {
  pokemonData: Pokemon[]
  isLoading: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  searchTerm: string
  setSearchTerm: (v: string) => void
  typeFilter: string | null
  setTypeFilter: (v: string | null) => void
}

export function PokemonListLayout({
  pokemonData,
  isLoading,
  isFetchingNextPage,
  fetchNextPage,
}: Props) {
  type RootStackParamList = { Home: undefined; Detail: { name: string } }
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    )
  }

  const types = [
    { label: 'normal', value: 'normal' },
    { label: 'fuego', value: 'fire' },
    { label: 'agua', value: 'water' },
    { label: 'planta', value: 'grass' },
    { label: 'eléctrico', value: 'electric' },
    { label: 'hielo', value: 'ice' },
    { label: 'lucha', value: 'fighting' },
    { label: 'veneno', value: 'poison' },
    { label: 'tierra', value: 'ground' },
    { label: 'volador', value: 'flying' },
    { label: 'psíquico', value: 'psychic' },
    { label: 'bicho', value: 'bug' },
    { label: 'roca', value: 'rock' },
    { label: 'fantasma', value: 'ghost' },
    { label: 'dragón', value: 'dragon' },
    { label: 'siniestro', value: 'dark' },
    { label: 'acero', value: 'steel' },
    { label: 'hada', value: 'fairy' },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Buscar por nombre"
          style={styles.input}
        />
      </View>

      <View style={styles.filtersRow}>
        {types.map(t => (
          <TouchableOpacity
            key={t.value}
            style={[styles.filterBtn, typeFilter === t.value && styles.filterBtnActive]}
            onPress={() => setTypeFilter(typeFilter === t.value ? null : t.value)}
          >
            <Text style={{ textTransform: 'capitalize' }}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={pokemonData}
        keyExtractor={item => item.name}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Detail', { name: item.name })}
            accessibilityRole="button"
            accessibilityLabel={`Ver detalles de ${item.name}`}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (!searchTerm && !typeFilter) fetchNextPage()
        }}
        ListFooterComponent={
          !searchTerm && !typeFilter && isFetchingNextPage ? (
            <ActivityIndicator style={{ margin: 12 }} />
          ) : null
        }
      />
    </View>
  )
}
