# PokedexApp

**Descripción general**
- Aplicación React Native (TypeScript) que consume la PokeAPI para mostrar un listado paginado de Pokémon, su detalle y manejo de favoritos.
- Tecnologías: React Native 0.82, React Navigation (stack), React Query (caché y offline-first), Zustand + persist con MMKV (favoritos), Axios (fetch), FastImage (sprites optimizados).
- Funcionalidades: lista con paginación y modo offline, búsqueda por nombre con debounce, filtro por tipo, navegación a detalle con sprite/tipos/habilidades/estadísticas, favoritos persistentes.

**Instalación y ejecución**
- Requisitos previos:
  - Node >= 20 y Yarn instalado
  - Android Studio con SDK/ADB y JDK 17 configurado (`JAVA_HOME` y `ANDROID_HOME`)
  - iOS (macOS): Xcode y CocoaPods
- Pasos:
  - Habilitar Yarn con Corepack: `corepack enable` (opcional)
  - Instalar dependencias con Yarn: `yarn install`
  - Iniciar Metro: `yarn start`
  - Android: `yarn android`
  - iOS:
    - `cd ios && bundle install && bundle exec pod install`
    - `yarn ios`

**Puntos a cumplir**
- Listado paginado de Pokémons con infinite scroll.
- Ficha de detalle al tocar un Pokémon con sprite, estadísticas, tipos y habilidades.
- Búsqueda por nombre con debounce para optimizar peticiones.
- Filtros por tipo (agua, fuego, planta, etc.).
- Filtro adicional por nombre (campo de búsqueda).
- Guardar favoritos localmente con persistencia (Zustand + MMKV).
- Caché de datos y modo offline-first para evitar refetches innecesarios.
- Toda paginación consultada se muestra offline al reabrir app (persistida en MMKV).
- Cada búsqueda realizada o tarjeta consultada se almacena y se muestra offline (MMKV + initialData).

**Notas y decisiones técnicas**
- Arquitectura por componentes/pantallas en 5 archivos: `fetchs.ts` (llamadas Axios), `controller.ts` (hooks de datos), `styles.ts` (StyleSheet), `layout.tsx` (UI), `index.ts(x)` (conector).
- React Query:
  - Configuración global (`api/queryClient.ts`) con `staleTime` y `gcTime` elevados para preservar caché.
  - Listado usa `useInfiniteQuery` y `networkMode: 'offlineFirst'`; búsqueda y filtro usan `useQuery` con caché y `staleTime`.
- Offline:
  - Detalle de Pokémon cacheado en MMKV con clave `pokemon:{name}` y usado como `initialData` para mostrar la ficha offline.
  - Listado paginado persistido en MMKV (`pokemon:list`) y usado como `initialData` en `useInfiniteQuery` para ver páginas consultadas offline.
  - Búsquedas y filtros por tipo se persisten por clave (`pokemon:search:{term}`, `pokemon:type:{type}`) y se usan como `initialData`.
- Favoritos:
  - Store `useFavorites` con Zustand y `persist` + MMKV, clave `favorites`, `toggleFavorite(name)`; se usa `pokemon.name` como identificador.
- Navegación:
  - Home → Detail con `name` en params; en Home, cada tarjeta navega mediante `useNavigation`.
- UI de Home:
  - `TextInput` con debounce (300 ms) para búsqueda exacta por nombre.
  - La paginación se desactiva cuando hay búsqueda o filtro activos.
- Consideraciones Android:
  - Usa JDK 17 y SDK configurado (`ANDROID_HOME`, `platform-tools` en `PATH`). Ejecuta `npx react-native doctor` si hay problemas.
- Próximas mejoras sugeridas:
  - Búsqueda parcial (substring) local con prefetch de páginas.
  - Manejo de errores/rehintentos visibles en `Detail` y `Home`.

**Uso de Yarn y verificación de lint**
- Este proyecto declara `packageManager: yarn@1.22.22` en `package.json` para estandarizar el uso de Yarn.
- Ejecuta `yarn install` para tener `eslint` local (v8) compatible con `.eslintrc.js`.
- Lint: `yarn lint` o `npx eslint@8 . --ext .ts,.tsx`.

**Nota importante**
- Actualmente existe un problema de dependencias y versiones que impide ejecutar correctamente `yarn run android`. Por motivos de tiempo no fue posible corregirlo.
