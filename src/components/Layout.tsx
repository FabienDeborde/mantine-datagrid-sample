import { ReactNode } from 'react'
import { AppShell, ColorScheme, createStyles, DefaultMantineColor } from '@mantine/core'

import Header from './Header'

type Props = {
  children: ReactNode;
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
  primaryColor: DefaultMantineColor;
  setPrimaryColor: (color: DefaultMantineColor) => void;
}

export default function Layout ({ colorScheme, toggleColorScheme, primaryColor, setPrimaryColor, children }: Props) {
  const { classes } = useStyles()
  return (
    <AppShell
      padding="md"
      classNames={{
        root: classes.root
      }}
      fixed
    >
      <Header
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
        primaryColor={primaryColor}
        setPrimaryColor={setPrimaryColor}
      />
      {children}
    </AppShell>
  )
}
const useStyles = createStyles((theme) => {
  return {
    root: {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.white,
      color: theme.colorScheme === 'dark' ? theme.white : theme.colors.dark[9]
    }
  }
})
