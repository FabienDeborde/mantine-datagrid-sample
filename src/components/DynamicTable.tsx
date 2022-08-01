import { useEffect, useRef, useState, useLayoutEffect, useCallback } from 'react'
import {
  Checkbox,
  ColumnDef,
  createColumnHelper,
  Datagrid,
  RowSelectionState,
  numberFilterFn,
  stringFilterFn,
  booleanFilterFn,
  dateFilterFn,
  ColumnFiltersState,
  SortingState,
  PaginationState,
  FilterState,
  InitialGridState
} from 'mantine-datagrid'

import { QueryParams, User } from './types'
import { genderFilterFn } from './filters'
import { getQueryParams, updateQueryParams } from '../utils'

import jsonData from '../mock/data.json'

const INITIAL_PAGE_INDEX = 0
const INITIAL_PAGE_SIZE = 10

type TableProps = {
  loading: boolean;
  initialState: InitialGridState;
  data: User[];
  onParamsUpdate: (params:any) => void;
}

const Table = ({ loading, initialState, data, onParamsUpdate }: TableProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const paginationRef = useRef<HTMLDivElement>(null)
  const [tableHeight, setTableHeight] = useState(0)

  const columnHelper = createColumnHelper<User>()

  useEffect(() => {
    console.debug('initialState', initialState)
  }, [initialState])

  useEffect(() => {
    console.debug('rerender')
  }, [])

  // Set table height
  useLayoutEffect(() => {
    if (containerRef.current) {
      setTimeout(() => {
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
      }, 100)
    }
  }, [containerRef, paginationRef])

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
    console.log('clicked row', row)
  }
  const onRowSelection = (selection: RowSelectionState) => {
    // console.log('selected rows', selection)
  }

  const onColumnFilterChange = (filters: ColumnFiltersState) => {
    const fields = []
    if (filters) {
      for (let index = 0; index < filters.length; index++) {
        const filter = filters[index]
        const { value, operator, meta } = filter.value as FilterState
        fields.push({
          key: filter.id,
          op: operator,
          val: value,
          meta
        })
      }
      onParamsUpdate({ fields })
    }
  }
  const onSortingChange = (sort: SortingState) => {
    if (sort?.[0]) {
      const { id, desc } = sort[0]
      onParamsUpdate({
        sort: id,
        order: desc ? 'desc' : 'asc'
      })
    } else {
      onParamsUpdate({
        sort: undefined,
        order: undefined
      })
    }
  }
  const onPaginationChange = (pagination: PaginationState) => {
    console.warn(`pagination, ${pagination}`)
    // const { pageIndex, pageSize } = pagination
    // onParamsUpdate({
    //   page: String(pageIndex + 1),
    //   limit: String(pageSize)
    // })
  }

  return (
    <Datagrid<User>
      loading={loading}
      debug={false}
      columns={columns}
      data={data}
      initialGridState={initialState}
      onRowClick={onRowClick}
      containerStyle={{}}
      containerRef={containerRef}
      containerMaxHeight={tableHeight}
      withPagination
      withTopPagination={false}
      paginationOptions={{
        initialPageIndex: initialState?.pagination.pageIndex || INITIAL_PAGE_INDEX,
        initialPageSize: initialState?.pagination.pageSize || INITIAL_PAGE_SIZE,
        pageSizes: ['10', '25', '50', '100', '250', '1000'],
        position: 'right'
      }}
      paginationRef={paginationRef}
      withGlobalFilter
      withRowSelection
      onRowSelection={onRowSelection}
      // withVirtualizedRows
      // virtualizedRowOverscan={25}
      onColumnFilterChange={onColumnFilterChange}
      onSortingChange={onSortingChange}
      onPaginationChange={onPaginationChange}
    />
  )
}

export default function DynamicTable () {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [initialState, setInitialState] = useState(null)

  const _handleParamsToState = () => {
    const params = getQueryParams()
    const { fields, sort, order, page, limit } = params as QueryParams

    const columnFilters = []
    if (fields) {
      for (const field of fields) {
        if (typeof field === 'object') {
          const { key, op, val, meta } = field
          let value: string|number|boolean = val
          if (!Number.isNaN(Number(val))) value = Number(val)
          if (val === 'true') value = true
          if (val === 'false') value = false

          columnFilters.push({
            id: key,
            value: {
              operator: op,
              value,
              meta
            }
          })
        }
      }
    }

    const state = {
      sorting: sort && [{ id: sort as string, desc: order === 'desc' }],
      columnFilters,
      pagination: page && {
        pageIndex: Number(page) - 1 || INITIAL_PAGE_INDEX,
        pageSize: Number(limit) || INITIAL_PAGE_SIZE
      }
    }
    setInitialState(state)
  }

  const _handleParamsUpdate = (params: QueryParams) => {
    console.log('new params', params)
    updateQueryParams(params)
    _handleParamsToState()
  }

  const fetchData = useCallback(
    () => {
      if (initialState) {
        console.info('fetch data...')
        setLoading(true)
        setTimeout(() => {
          setLoading(false)
          setData(jsonData)
        }, 1000)
      }
    },
    [initialState]
  )

  useEffect(() => {
    _handleParamsToState()
  }, [])

  useEffect(() => {
    fetchData()
  }, [initialState])

  if (!initialState) return null

  return (
    <Table
      loading={loading}
      data={data}
      initialState={initialState}
      onParamsUpdate={_handleParamsUpdate}
    />
  )
}
