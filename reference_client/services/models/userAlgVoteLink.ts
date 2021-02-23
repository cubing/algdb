import type { RecordInfo } from '~/types'
import TimeagoColumn from '~/components/table/common/timeagoColumn.vue'

export default <RecordInfo<'userAlgVoteLink'>>{
  type: 'userAlgVoteLink',
  name: 'User-Alg-Vote-Link',
  icon: 'mdi-link',
  renderItem: (item) => `${item.alg.sequence} -> ${item.user.name}`,
  options: {
    sortBy: ['created_at'],
    sortDesc: [true],
  },
  hasSearch: false,
  filters: [],
  fields: {
    'user.id': {
      text: 'User',
      default: (that) => that.$store.getters['auth/user']?.id,
    },
    'alg.id': {
      text: 'Alg',
    },
    vote_value: {
      text: 'Vote Value',
    },
    'user.name': {
      text: 'User Name',
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
    fields: ['user.id', 'alg.id', 'vote_value'],
  },
  editOptions: undefined,
  viewOptions: undefined,
  deleteOptions: {},
  shareOptions: undefined,
  headers: [
    {
      field: 'user.name',
      sortable: false,
    },
    {
      field: 'alg.sequence',
      sortable: false,
    },
    {
      field: 'vote_value',
      width: '100px',
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
