import { InputTypes, MainTypes, FilterByField } from '~/types/schema'

export type RecordInfo<T extends keyof MainTypes> = {
  // name of the type
  type: T
  name: string
  icon?: string
  options: {
    // default sortBy/Desc for the interface
    sortBy: `get${Capitalize<T>}Paginator` extends keyof InputTypes
      ? InputTypes[`get${Capitalize<T>}Paginator`]['sortBy']
      : []
    sortDesc: boolean[]
  }
  // does the interface have a search bar?
  hasSearch: `get${Capitalize<T>}Paginator` extends keyof InputTypes
    ? 'search' extends keyof InputTypes[`get${Capitalize<T>}Paginator`]
      ? boolean
      : false
    : false
  // all of the possible usable filters
  filters: `${T}FilterByObject` extends keyof InputTypes
    ? RecordFilter<InputTypes[`${T}FilterByObject`]>[]
    : []
  // all of the "known" fields of the type. could be nested types (not included in type hints)
  fields?: {
    [K in keyof MainTypes[T]['Type']]?: {
      text: string
      icon?: string
      getOptions?: Function
      default?: Function
      serialize?: (val: unknown) => unknown // fetching from API
      parseValue?: (val: unknown) => unknown // submitting to API
      renderFn?: (val) => any // how it is displayed in the table
    }
  }

  addOptions?: {
    // required: fields that can be added
    fields: string[]
    // custom component
    component?: any
    // if not createX, the custom create operation name
    operationName?: string
  }

  editOptions?: {
    // required: fields that can be added
    fields: string[]
    // custom component
    component?: any
    // if not createX, the custom create operation name
    operationName?: string
  }

  deleteOptions?: {
    // no fields when deleting
    // custom component
    component?: any
    // if not createX, the custom create operation name
    operationName?: string
    // how the item should display on the delete dialog
    renderItem?: (item: any) => string
  }

  viewOptions?: {
    // required: fields that can be added
    fields: string[]
    // custom component
    component?: any
    // if not createX, the custom create operation name
    // currently must use getX
    // operationName?: string
  }

  // the headers of the table
  headers: {
    field: keyof MainTypes[T]['Type']
    width?: string
    sortable: boolean
    align?: string
  }[]
  headerActionOptions?: {
    text?: string
    width?: string
  }
  handleRowClick?: (that, item) => void
  interfaceComponent?: any
  expandTypes?: {
    recordInfo: RecordInfo<any>
    // headers fields that should not be shown
    excludeHeaders?: string[]
  }[]
}

export type RecordFilter<T> = {
  field: keyof T
  operator: keyof FilterByField<any>
}
