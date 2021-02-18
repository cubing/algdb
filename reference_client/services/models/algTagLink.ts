import { getTags } from '../dropdown'
import type { RecordInfo } from '~/types'
import { generateTimeAgoString } from '~/services/common'

export default <RecordInfo<'algTagLink'>>{
  type: 'algTagLink',
  name: 'Alg-Tag-Link',
  icon: 'mdi-link',
  options: {
    sortBy: ['created_at'],
    sortDesc: [true],
  },
  hasSearch: false,
  filters: [
    {
      field: 'alg.id',
      operator: 'eq',
    },
  ],
  fields: {
    'tag.id': {
      text: 'Tag',
      getOptions: getTags,
    },
    'alg.id': {
      text: 'Alg',
    },
    'tag.name': {
      text: 'Tag Name',
    },
    'alg.sequence': {
      text: 'Alg Sequence',
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
    fields: ['tag.id', 'alg.id'],
  },
  editOptions: undefined,
  viewOptions: undefined,
  deleteOptions: {
    renderItem: (item) => `${item.alg.sequence} -> ${item.tag.name}`,
  },
  headers: [
    {
      field: 'tag.name',
      sortable: false,
    },
    {
      field: 'alg.sequence',
      sortable: false,
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
}
