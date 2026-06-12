import 'styled-components'
import type { Theme } from './design-system/theme/theme'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: Theme['colors']
    spacing: Theme['spacing']
    radii: Theme['radii']
    typography: Theme['typography']
    shadows: Theme['shadows']
  }
}
