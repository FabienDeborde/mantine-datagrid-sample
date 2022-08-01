import {
  ColorScheme,
  ColorSchemeProvider,
  DefaultMantineColor,
  MantineProvider
} from '@mantine/core'
import { useHotkeys, useLocalStorage } from '@mantine/hooks'

import { theme } from './theme'

import Main from './Main'
import Layout from './components/Layout'

function App () {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true
  })
  const [primaryColor, setPrimaryColor] = useLocalStorage<DefaultMantineColor>({
    key: 'mantine-primary-color',
    defaultValue: 'blue',
    getInitialValueInEffect: true
  })
  const toggleColorScheme = () => setColorScheme(current => current === 'dark' ? 'light' : 'dark')

  useHotkeys([['mod+J', toggleColorScheme]])

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ ...theme, primaryColor, colorScheme }} withNormalizeCSS>
        <Layout
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
          primaryColor={primaryColor}
          setPrimaryColor={setPrimaryColor}
        >
          <Main />
        </Layout>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default App
