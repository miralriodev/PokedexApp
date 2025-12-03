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
  - Instalar dependencias: `npm install`
  - Iniciar Metro: `npm start`
  - Android: `npm run android`
  - iOS:
    - `cd ios && bundle install && bundle exec pod install`
    - `yarn ios`

**Notas y decisiones técnicas**
- Arquitectura por componentes/pantallas en 5 archivos: `fetchs.ts` (llamadas Axios), `controller.ts` (hooks de datos), `styles.ts` (StyleSheet), `layout.tsx` (UI), `index.ts(x)` (conector).
- React Query:
  - Configuración global (`api/queryClient.ts`) con `staleTime` y `gcTime` elevados para preservar caché.
  - Listado usa `useInfiniteQuery` y `networkMode: 'offlineFirst'`; búsqueda y filtro usan `useQuery` con caché y `staleTime`.
- Offline:
  - Detalle de Pokémon cacheado en MMKV con clave `pokemon:{name}` y usado como `initialData` para mostrar la ficha offline.
  - El listado paginado sigue visible offline para las páginas consultadas gracias al caché de React Query.
- Favoritos:
  - Store `useFavorites` con Zustand y `persist` + MMKV, clave `favorites`, `toggleFavorite(name)`; se usa `pokemon.name` como identificador.
- Navegación:
  - Home → Detail con `name` en params; en Home, cada tarjeta navega mediante `useNavigation`.
- UI de Home:
  - `TextInput` con debounce (300 ms) para búsqueda exacta por nombre.
  - Selector de tipos con etiquetas en español mapeadas a los valores de la API (`fuego` → `fire`, `agua` → `water`, etc.).
  - La paginación se desactiva cuando hay búsqueda o filtro activos.
- Consideraciones Android:
  - Usa JDK 17 y SDK configurado (`ANDROID_HOME`, `platform-tools` en `PATH`). Ejecuta `npx react-native doctor` si hay problemas.
- Próximas mejoras sugeridas:
  - Búsqueda parcial (substring) local con prefetch de páginas.
  - Manejo de errores/rehintentos visibles en `Detail` y `Home`.

**Nota importante**
- Actualmente existe un problema de dependencias y versiones que impide ejecutar correctamente `npm run android`. Por motivos de tiempo no fue posible corregirlo.
