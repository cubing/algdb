export type RecordInfo = {
  type: string
  options: {
    sortBy: string[]
    sortDesc: boolean[]
  }
  hasSearch: boolean
  filters: RecordFilter[]
  inputs: {
    [x: string]: {
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
  nested?: RecordInfo
}

export type RecordFilter = {
  field: string
  label: string
  icon?: string
  operator: string
  parseValue?: Function
  getOptions?: Function
  default?: Function
}
