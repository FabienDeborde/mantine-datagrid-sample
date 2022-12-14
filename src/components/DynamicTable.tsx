import { useEffect, useRef, useState, useLayoutEffect } from 'react'
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
  GridState
} from '@fabiendeborde/mantine-datagrid'

import { QueryParams, User } from './types'
import { genderFilterFn } from './filters'
import { getQueryParams, updateQueryParams } from '../utils'

import { getUsers } from '../utils/api'

const INITIAL_PAGE_INDEX = 0
const INITIAL_PAGE_SIZE = 10
const DEFAULT_QUERY_PARAMS = {
  page: String(INITIAL_PAGE_INDEX + 1),
  limit: String(INITIAL_PAGE_SIZE)
}

export default function DynamicTable () {
  const containerRef = useRef<HTMLDivElement>(null)
  const paginationRef = useRef<HTMLDivElement>(null)
  const [tableHeight, setTableHeight] = useState(0)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [dataLength, setDataLength] = useState(0)
  const [pagination, setPagination] = useState<PaginationState>()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>()
  const [sorting, setSorting] = useState<SortingState>()

  const _handleParamsToState = (params: QueryParams): GridState => {
    const { fields, sort, order, page, limit } = params

    const pageIndex = Number(page) ? Number(page) - 1 : 0
    const pageSize = Number(limit)

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
      pagination: {
        pageIndex: pageIndex || INITIAL_PAGE_INDEX,
        pageSize: pageSize || INITIAL_PAGE_SIZE
      }
    }
    return state
  }

  const _handleParamsUpdate = (params: QueryParams) => {
    const query = getQueryParams()
    updateQueryParams(params)
    fetchData({ ...query, ...params })
  }

  const fetchData = async (params: QueryParams) => {
    if (params) {
      setLoading(true)
      const data = await getUsers({ ...DEFAULT_QUERY_PARAMS, ...params })
      setLoading(false)
      setData(data.results)
      setDataLength(data.count)
    }
  }

  // Set inital state on page load & fetch data
  useEffect(() => {
    const query = getQueryParams() as QueryParams
    const state = _handleParamsToState(query)
    setPagination(state.pagination)
    setColumnFilters(state.columnFilters)
    setSorting(state.sorting)
    fetchData(query)
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

  const columnHelper = createColumnHelper<User>()
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
  const onColumnFilterChange = (filters: ColumnFiltersState) => {
    setColumnFilters(filters)
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
      _handleParamsUpdate({ fields })
    }
  }
  const onSortingChange = (sort: SortingState) => {
    setSorting(sort)
    if (sort?.[0]) {
      const { id, desc } = sort[0]
      _handleParamsUpdate({
        sort: id,
        order: desc ? 'desc' : 'asc'
      })
    } else {
      _handleParamsUpdate({
        sort: undefined,
        order: undefined
      })
    }
  }
  const onPaginationChange = (state: PaginationState) => {
    const { pageIndex, pageSize } = state

    if (pagination.pageIndex !== pageIndex || pagination.pageSize !== pageSize) {
      const nextPagination = {
        pageIndex: pageSize !== pagination.pageSize ? 0 : pageIndex,
        pageSize
      }
      setPagination(nextPagination)

      _handleParamsUpdate({
        page: String(pageSize !== pagination.pageSize ? 1 : pageIndex + 1),
        limit: String(pageSize)
      })
    }
  }

  return (
    <Datagrid<User>
      loading={loading}
      debug={false}
      columns={columns}
      data={data}
      gridState={{
        pagination,
        columnFilters,
        sorting
      }}
      onRowClick={onRowClick}
      containerStyle={{}}
      containerRef={containerRef}
      containerMaxHeight={tableHeight}
      manualPagination
      withPagination
      withTopPagination={false}
      paginationOptions={{
        initialPageIndex: 0,
        initialPageSize: 10,
        pageSizes: ['10', '25', '50', '100', '250', '1000'],
        position: 'right',
        rowsCount: dataLength,
        pageCount: Math.ceil(dataLength / (pagination?.pageSize || INITIAL_PAGE_SIZE))
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
