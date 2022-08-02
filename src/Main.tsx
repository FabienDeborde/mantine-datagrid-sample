import { useEffect, useState } from 'react'
import { Tabs } from '@mantine/core'
import { AccessPoint, AccessPointOff } from 'tabler-icons-react'

import { getQueryParams, overwriteQueryParams } from './utils'

import DynamicTable from './components/DynamicTable'
import StaticTable from './components/StaticTable'

const TAB_KEY = 'tab'
const DEFAULT_TAB = 'static'

export default function Main () {
  const [activeTab, setActiveTab] = useState<string>('')

  useEffect(() => {
    const params = getQueryParams()
    const currentTab = params?.[TAB_KEY] as string || DEFAULT_TAB
    setActiveTab(currentTab)
  }, [])

  const _handleTabChange = (tab: string) => {
    if (tab) {
      setActiveTab(tab)
      overwriteQueryParams({
        [TAB_KEY]: tab
      })
    }
  }

  return (
    <Tabs mt="lg" value={activeTab} onTabChange={_handleTabChange} allowTabDeactivation>
      <Tabs.List>
        <Tabs.Tab value="static" icon={<AccessPointOff size={14} />}>Static</Tabs.Tab>
        <Tabs.Tab value="dynamic" icon={<AccessPoint size={14} />}>Dynamic</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="static" pt="sm">
        <StaticTable active={activeTab === 'static'} />
      </Tabs.Panel>
      <Tabs.Panel value="dynamic" pt="sm">
        <DynamicTable active={activeTab === 'dynamic'} />
      </Tabs.Panel>
    </Tabs>
  )
}
