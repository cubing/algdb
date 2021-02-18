import type { RecordInfo } from '~/types'
import { generateTimeAgoString } from '~/services/common'

export default <RecordInfo<'userAlgVoteLink'>>{
  type: 'userAlgVoteLink',
  name: 'User-Alg-Vote-Link',
  icon: 'mdi-link',
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
      renderFn: (val) => generateTimeAgoString(val),
    },
    updated_at: {
      text: 'Updated At',
      renderFn: (val) => generateTimeAgoString(val),
    },
  },
  addOptions: {
    fields: ['user.id', 'alg.id', 'vote_value'],
  },
  editOptions: undefined,
  viewOptions: undefined,
  deleteOptions: {
    renderItem: (item) => `${item.alg.sequence} -> ${item.user.name}`,
  },
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
