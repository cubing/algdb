import type { RecordInfo } from '~/types'
import TimeagoColumn from '~/components/table/common/timeagoColumn.vue'

export default <RecordInfo<'algAlgcaseLink'>>{
  type: 'algAlgcaseLink',
  name: 'Alg-Algcase-Link',
  icon: 'mdi-link',
  renderItem: (item) => `${item.alg.sequence} -> ${item.algcase.name}`,
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
      component: TimeagoColumn,
    },
    updated_at: {
      text: 'Updated At',
      component: TimeagoColumn,
    },
  },
  addOptions: {
    fields: ['alg.id', 'algcase.id'],
  },
  editOptions: undefined,
  viewOptions: undefined,
  deleteOptions: {},
  shareOptions: undefined,
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
