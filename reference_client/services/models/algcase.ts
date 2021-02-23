import type { RecordInfo } from '~/types'
import algRecordInfo from '~/services/models/alg'
import { getPuzzles } from '~/services/dropdown'
import TimeagoColumn from '~/components/table/common/timeagoColumn.vue'

export default <RecordInfo<'algcase'>>{
  type: 'algcase',
  name: 'Algcase',
  icon: undefined,
  renderItem: (item) => item.name,
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
    {
      field: 'algset.id',
      operator: 'eq',
    },
    {
      field: 'id',
      operator: 'eq',
    },
  ],
  fields: {
    id: {
      text: 'ID',
    },
    name: {
      text: 'Name',
    },
    'algset.id': {
      text: 'Algset',
      parseValue: (val) => Number(val),
      optionsInfo: {
        optionsType: 'algset',
        inputType: 'server-autocomplete',
      },
    },
    created_at: {
      text: 'Created At',
      component: TimeagoColumn,
    },
    updated_at: {
      text: 'Updated At',
      component: TimeagoColumn,
    },
    'puzzle.id': {
      text: 'Puzzle',
      parseValue: (val) => Number(val),
      optionsInfo: {
        getOptions: getPuzzles,
        optionsType: 'puzzle',
        inputType: 'autocomplete',
      },
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
  deleteOptions: {},
  shareOptions: {
    route: '/algcases',
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
