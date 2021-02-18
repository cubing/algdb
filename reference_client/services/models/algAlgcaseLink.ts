import type { RecordInfo } from '~/types'
import { generateTimeAgoString } from '~/services/common'

export default <RecordInfo<'algAlgcaseLink'>>{
  type: 'algAlgcaseLink',
  name: 'Alg-Algcase-Link',
  icon: 'mdi-link',
  options: {
    sortBy: ['created_at'],
    sortDesc: [true],
  },
  hasSearch: false,
  filters: [],
  fields: {
    'alg.id': {
      text: 'Alg',
    },
    'algcase.id': {
      text: 'Alg Case',
    },
    'algcase.name': {
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
    fields: ['alg.id', 'algcase.id'],
  },
  editOptions: undefined,
  viewOptions: undefined,
  deleteOptions: {
    renderItem: (item) => `${item.alg.sequence} -> ${item.algcase.name}`,
  },
  headers: [
    {
      field: 'algcase.name',
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
