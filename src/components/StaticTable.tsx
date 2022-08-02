import { useEffect, useRef, useState } from 'react'
import {
  Checkbox,
  ColumnDef,
  createColumnHelper,
  Datagrid,
  RowSelectionState,
  numberFilterFn,
  stringFilterFn,
  booleanFilterFn,
  dateFilterFn
} from 'mantine-datagrid'

import { TabProps, User } from './types'
import { genderFilterFn } from './filters'

import data from '../mock/data.json'

export default function StaticTable ({ active }: TabProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const paginationRef = useRef<HTMLDivElement>(null)
  const [tableHeight, setTableHeight] = useState(0)

  const columnHelper = createColumnHelper<User>()

  useEffect(() => {
    if (containerRef.current) {
      const pageHeight = window.innerHeight

      const container = containerRef.current
      const coord = container.getBoundingClientRect()

      const styles = window.getComputedStyle(container)
      const paddingTop = parseFloat(styles.getPropertyValue('padding-top'))
      const paddingBottom = parseFloat(styles.getPropertyValue('padding-bottom'))

      const mainElement = document.querySelector('main.mantine-AppShell-main')
      const mainStyles = window.getComputedStyle(mainElement)
      const mainPaddingTop = parseFloat(mainStyles.getPropertyValue('padding-top'))
      const mainPaddingBottom = parseFloat(mainStyles.getPropertyValue('padding-bottom'))

      const pagination = paginationRef?.current
      const paginationCoord = pagination?.getBoundingClientRect()
      const paginationHeight = paginationCoord?.height || 0

      const height = pageHeight - coord.top - paddingTop - paddingBottom - mainPaddingTop - mainPaddingBottom - paginationHeight

      setTableHeight(height)
    }
  }, [paginationRef])

  if (!active) return null

  const columns: ColumnDef<User>[] = [
    columnHelper.display({
      id: 'select',
      maxSize: 32,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      )
    }),
    columnHelper.accessor(row => row.id.toString(), {
      id: 'id',
      header: 'User ID',
      filterFn: numberFilterFn
    }),
    columnHelper.group({
      id: 'Name',
      header: 'Name',
      columns: [
        columnHelper.accessor('first_name', {
          header: 'First Name',
          enableColumnFilter: true,
          filterFn: stringFilterFn
        }),
        columnHelper.accessor('last_name', {
          header: 'Last Name',
          filterFn: stringFilterFn
        })
      ]
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      filterFn: stringFilterFn
    }),
    columnHelper.accessor('gender', {
      header: 'Gender',
      filterFn: genderFilterFn
    }),
    columnHelper.accessor(row => row.age.toString(), {
      id: 'age',
      header: 'Age',
      filterFn: numberFilterFn
    }),
    columnHelper.accessor('ip_address', {
      header: 'IP Address',
      enableSorting: false,
      filterFn: stringFilterFn
    }),
    columnHelper.accessor('active', {
      header: 'Active',
      filterFn: booleanFilterFn
    }),
    columnHelper.accessor('active_since', {
      header: 'Active Since',
      filterFn: dateFilterFn
    })
  ]

  const onRowClick = (row: User) => {
    // console.log('clicked row', row)
  }
  const onRowSelection = (selection: RowSelectionState) => {
    // console.log('selected rows', selection)
  }

  return (
    <Datagrid<User>
      loading={false}
      debug={false}
      columns={columns}
      data={data}
      onRowClick={onRowClick}
      containerStyle={{}}
      containerRef={containerRef}
      containerMaxHeight={tableHeight}
      withPagination
      withTopPagination={false}
      paginationOptions={{
        initialPageIndex: 0,
        initialPageSize: 10,
        pageSizes: ['10', '25', '50', '100', '250', '1000'],
        position: 'right'
      }}
      paginationRef={paginationRef}
      withGlobalFilter
      withRowSelection
      onRowSelection={onRowSelection}
      withVirtualizedRows
      virtualizedRowOverscan={25}
    />
  )
}
