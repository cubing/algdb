import { InputTypes, MainTypes, Scalars } from '~/types/schema'

export type RecordInfo<T extends keyof MainTypes> = {
  type: T
  options: {
    sortBy: `get${Capitalize<T>}Paginator` extends keyof InputTypes
      ? InputTypes[`get${Capitalize<T>}Paginator`]['sortBy']
      : []
    sortDesc: boolean[]
  }

  hasSearch: `get${Capitalize<T>}Paginator` extends keyof InputTypes
    ? 'search' extends keyof InputTypes[`get${Capitalize<T>}Paginator`]
      ? true
      : false
    : false
  filters: `${T}FilterByObject` extends keyof InputTypes
    ? RecordFilter<InputTypes[`${T}FilterByObject`]>[]
    : []
  inputs: {
    [K in keyof MainTypes[T]['Type']]?: {
      text: string
      addable: boolean
      editable: boolean
      viewable: boolean
      getOptions?: Function
      default?: Function
      serialize?: (val: unknown) => unknown // fetching from API
      parseValue?: (val: unknown) => unknown // submitting to API
    }
  }
  headers: any[]
  handleRowClick?: (that, item) => void
  addRecordComponent?: any | null
  editRecordComponent?: any | null
  deleteRecordComponent?: any | null
  viewRecordComponent?: any | null
  interfaceComponent?: any
  nested?: RecordInfo<any>
}

export type RecordFilter<T> = {
  field: keyof T
  label: string
  icon?: string
  operator: Scalars['filterOperator']
  parseValue?: Function
  getOptions?: Function
  default?: Function
}
