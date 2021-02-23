import { getUsertags } from '../dropdown'
import type { RecordInfo } from '~/types'
import TimeagoColumn from '~/components/table/common/timeagoColumn.vue'

export default <RecordInfo<'algUsertagLink'>>{
  type: 'algUsertagLink',
  name: 'Alg-Usertag-Link',
  icon: 'mdi-link',
  renderItem: (item) => `${item.alg.sequence} -> ${item.usertag.name}`,
  options: {
    sortBy: ['created_at'],
    sortDesc: [true],
  },
  hasSearch: false,
  filters: [],
  fields: {
    'usertag.id': {
      text: 'User Tag',
      optionsInfo: {
        getOptions: getUsertags,
        optionsType: 'usertag',
        inputType: 'combobox',
      },
    },
    'alg.id': {
      text: 'Alg',
    },
    'usertag.name': {
      text: 'Usertag Name',
    },
    'alg.sequence': {
      text: 'Alg Sequence',
    },
    'created_by.name': {
      text: 'Created By',
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
    fields: ['usertag.id', 'alg.id'],
  },
  editOptions: undefined,
  viewOptions: undefined,
  deleteOptions: {},
  headers: [
    {
      field: 'usertag.name',
      sortable: false,
    },
    {
      field: 'alg.sequence',
      sortable: false,
    },
    {
      field: 'created_by.name',
      width: '200px',
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
