import { ComponentPropsWithoutRef, forwardRef } from 'react'
import {
  ActionIcon,
  ColorScheme,
  DefaultMantineColor,
  Group,
  Indicator,
  Select,
  Stack,
  Text,
  Title,
  createStyles
} from '@mantine/core'
import { Sun, MoonStars } from 'tabler-icons-react'

interface SelectItemProps extends ComponentPropsWithoutRef<'div'> {
  label: string;
}

type Props = {
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
  primaryColor: DefaultMantineColor;
  setPrimaryColor: (color: DefaultMantineColor) => void;
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ label, ...rest }: SelectItemProps, ref) => {
    return (
      <div ref={ref} {...rest}>
        <Group noWrap py={4} px="sm" align="center">
          <Indicator color={label}><div></div></Indicator>
          <Text size="sm">{label}</Text>
        </Group>
      </div>
    )
  }
)
SelectItem.displayName = 'SelectItem'

export default function Header ({ colorScheme, toggleColorScheme, primaryColor, setPrimaryColor }: Props) {
  const { classes } = useStyles()
  const dark = colorScheme === 'dark'

  return (
    <Stack p="md" className={classes.header}>
      <Group position='apart'>
        <Title>Datagrid Sample</Title>
        <ActionIcon
          variant="outline"
          color={dark ? 'yellow' : 'blue'}
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
        >
          {dark ? <Sun size={18} /> : <MoonStars size={18} />}
        </ActionIcon>
      </Group>
      <Group>
        <Select
          description="Theme primary color"
          value={primaryColor}
          onChange={setPrimaryColor}
          itemComponent={SelectItem}
          data={[
            'dark',
            'gray',
            'red',
            'pink',
            'grape',
            'violet',
            'indigo',
            'blue',
            'cyan',
            'green',
            'lime',
            'yellow',
            'orange',
            'teal'
          ]}
        />
      </Group>
    </Stack>
  )
}

const useStyles = createStyles((theme) => {
  return {
    header: {
      position: 'relative',
      zIndex: 99999
    }
  }
})
