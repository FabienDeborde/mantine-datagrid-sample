import { Select } from '@mantine/core'
import {
  DataGridFilterFn,
  DataGridFilterProps
} from 'mantine-datagrid'
import { User } from '../types'

type Filter = {
  operator: 'eq';
  value: string;
}

export const genderFilterFn: DataGridFilterFn<User, Filter> = (row, columnId, filter) => {
  const rowValue = String(row.getValue(columnId))
  const filterValue = String(filter.value)
  return rowValue === filterValue
}
genderFilterFn.autoRemove = (val) => !val
genderFilterFn.initialFilter = () => ({
  operator: 'eq',
  value: ''
})
genderFilterFn.filterComponent = function ({ filterState, onFilterChange }: DataGridFilterProps<Filter>) {
  const onValueChange = (value: string) => onFilterChange({ ...filterState, value: value || '' })
  return (
    <Select
      data={[
        'Female',
        'Male'
      ]}
      value={filterState.value || ''}
      onChange={onValueChange}
      placeholder="Filter value"
    />
  )
}
