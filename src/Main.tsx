import { useEffect, useState } from 'react'
import { Tabs } from '@mantine/core'
import { AccessPoint, AccessPointOff } from 'tabler-icons-react'

import DynamicTable from './components/DynamicTable'
import StaticTable from './components/StaticTable'
import { getQueryParams, updateQueryParams } from './utils'

const TAB_KEY = 'tab'
const DEFAULT_TAB = 'static'

export default function Main () {
  const [activeTab, setActiveTab] = useState<string | null>(DEFAULT_TAB)

  useEffect(() => {
    const params = getQueryParams()
    const currentTab = params?.[TAB_KEY] as string || DEFAULT_TAB
    setActiveTab(currentTab)
  }, [])

  const _handleTabChange = (tab: string) => {
    setActiveTab(tab)
    updateQueryParams({ [TAB_KEY]: tab })
  }

  return (
    <Tabs mt="lg" value={activeTab} onTabChange={_handleTabChange}>
      <Tabs.List>
        <Tabs.Tab value="static" icon={<AccessPointOff size={14} />}>Static</Tabs.Tab>
        <Tabs.Tab value="dynamic" icon={<AccessPoint size={14} />}>Dynamic</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="static" pt="sm">
        <StaticTable />
      </Tabs.Panel>
      <Tabs.Panel value="dynamic" pt="sm">
        <DynamicTable />
      </Tabs.Panel>
    </Tabs>
  )
}
