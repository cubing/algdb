import type { RecordInfo } from '~/types'
import algsetRecordInfo from '~/services/models/algset'
import { getBooleanOptions } from '~/services/dropdown'
import { generateTimeAgoString } from '~/services/common'

export default <RecordInfo<'puzzle'>>{
  type: 'puzzle',
  name: 'Puzzle',
  icon: 'mdi-view-grid',
  options: {
    sortBy: ['created_at'],
    sortDesc: [true],
  },
  hasSearch: true,
  filters: [
    {
      field: 'is_public',
      operator: 'eq',
    },
  ],
  fields: {
    name: {
      text: 'Name',
    },
    code: {
      text: 'Code',
    },
    is_public: {
      text: 'Public',
      getOptions: getBooleanOptions,
      parseValue: (val) => (typeof val === 'boolean' ? val : val === 'true'),
    },
    created_at: {
      text: 'Created At',
      renderFn: (val) => generateTimeAgoString(val),
    },
    updated_at: {
      text: 'Updated At',
      renderFn: (val) => generateTimeAgoString(val),
    },
  },
  addOptions: {
    fields: ['name', 'code', 'is_public'],
  },
  editOptions: {
    fields: ['name', 'code', 'is_public'],
  },
  viewOptions: {
    fields: ['name', 'code', 'is_public'],
  },
  deleteOptions: {
    renderItem: (item) => item.name,
  },
  headers: [
    {
      field: 'name',
      sortable: false,
    },
    {
      field: 'code',
      sortable: false,
      width: '150px',
    },
    {
      field: 'created_at',
      sortable: true,
      width: '150px',
    },
    {
      field: 'updated_at',
      sortable: true,
      width: '150px',
    },
  ],
  expandTypes: [
    {
      recordInfo: algsetRecordInfo,
    },
  ],
}
