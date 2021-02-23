import { InputTypes, MainTypes, FilterByField } from '~/types/schema'

export type RecordInfo<T extends keyof MainTypes> = {
  // name of the type
  type: T
  name: string
  icon?: string
  // how to render the item as a string
  renderItem?: (item) => string
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
      text?: string
      icon?: string
      optionsInfo?: {
        getOptions?: (that) => Promise<any[]>
        optionsType?: string
        inputType:
          | 'combobox' // combobox allows the user to add new inputs on the fly (will change to autocomplete in filter interfaces)
          | 'autocomplete' // same as combobox but cannot add new inputs
          | 'server-autocomplete' // if there's lots of entries, may not want to fetch all of the entries at once. getOptions will be optional
          | 'select' // standard select
      }
      // is the field hidden? if yes, won't fetch it for edit fields
      hidden?: boolean
      default?: (that) => unknown
      serialize?: (val: unknown) => unknown // fetching from API
      parseValue?: (val: unknown) => unknown // submitting to API
      component?: any // component for rendering the field in table, if not using renderFn
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

  shareOptions?: {
    // custom component
    component?: any
    // the route used to share the item, must start with /
    route: string
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
    // name for the expandType, otherwise recordInfo.name will be used
    name?: string
    // function that will replace the lockedSubFilters() computed property in crud.js if provided
    lockedFilters?: (that, item) => FilterObject[]
    // headers fields that should not be shown
    excludeHeaders?: string[]
    // filter fields that should not be shown (however, they can still be manipulated in a custom component file)
    excludeFilters?: string[]
    // initial filters that should be loaded into the nested component
    initialFilters?: FilterObject[]
  }[]
}

type FilterObject = {
  field: string
  operator: string
  value: any
}

export type RecordFilter<T> = {
  field: keyof T
  operator: keyof FilterByField<any>
}
