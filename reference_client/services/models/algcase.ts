import type { RecordInfo } from '~/types'
import algRecordInfo from '~/services/models/alg'
import { getPuzzles } from '~/services/dropdown'
import { generateTimeAgoString } from '~/services/common'

export default <RecordInfo<'algcase'>>{
  type: 'algcase',
  name: 'Algcase',
  options: {
    sortBy: ['created_at'],
    sortDesc: [true],
  },
  hasSearch: true,
  filters: [
    {
      field: 'puzzle.id',
      operator: 'eq',
    },
  ],
  fields: {
    name: {
      text: 'Name',
    },
    'algset.id': {
      text: 'Algset ID',
    },
    created_at: {
      text: 'Created At',
      renderFn: (val) => generateTimeAgoString(val),
    },
    updated_at: {
      text: 'Updated At',
      renderFn: (val) => generateTimeAgoString(val),
    },
    'puzzle.id': {
      text: 'Puzzle ID',
      parseValue: (val) => Number(val),
      getOptions: getPuzzles,
    },
  },
  addOptions: {
    fields: ['name', 'algset.id'],
  },
  editOptions: {
    fields: ['name'],
  },
  viewOptions: {
    fields: ['name', 'algset.id'],
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
      recordInfo: algRecordInfo,
    },
  ],
}
