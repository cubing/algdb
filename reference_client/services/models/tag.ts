import { getTags } from '../dropdown'
import algTagLinkRecordInfo from './algTagLink'
import type { RecordInfo } from '~/types'
import { generateTimeAgoString } from '~/services/common'

export default <RecordInfo<'tag'>>{
  type: 'tag',
  name: 'Tag',
  icon: 'mdi-tag',
  options: {
    sortBy: ['created_at'],
    sortDesc: [true],
  },
  hasSearch: true,
  filters: [],
  fields: {
    name: {
      text: 'Name',
    },
    'tag.id': {
      text: 'Tag',
      getOptions: getTags,
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
    fields: ['name'],
  },
  editOptions: {
    fields: ['name'],
  },
  viewOptions: {
    fields: ['name'],
  },
  deleteOptions: {
    renderItem: (item) => item.name,
  },
  headers: [
    {
      field: 'name',
      sortable: true,
    },
    {
      field: 'created_at',
      width: '150px',
      sortable: true,
    },
    {
      field: 'updated_at',
      width: '150px',
      sortable: true,
    },
  ],
  expandTypes: [
    {
      recordInfo: algTagLinkRecordInfo,
      excludeHeaders: ['tag.name'],
    },
  ],
}
