import { getTags } from '../dropdown'
import type { RecordInfo } from '~/types'
import TimeagoColumn from '~/components/table/common/timeagoColumn.vue'

export default <RecordInfo<'algTagLink'>>{
  type: 'algTagLink',
  name: 'Alg-Tag-Link',
  icon: 'mdi-link',
  renderItem: (item) => `${item.alg.sequence} -> ${item.tag.name}`,
  options: {
    sortBy: ['created_at'],
    sortDesc: [true],
  },
  hasSearch: false,
  filters: [],
  fields: {
    'tag.id': {
      text: 'Tag',
      optionsInfo: {
        getOptions: getTags,
        optionsType: 'tag',
        inputType: 'combobox',
      },
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
      component: TimeagoColumn,
    },
    updated_at: {
      text: 'Updated At',
      component: TimeagoColumn,
    },
  },
  addOptions: {
    fields: ['tag.id', 'alg.id'],
  },
  editOptions: undefined,
  viewOptions: undefined,
  deleteOptions: {},
  shareOptions: undefined,
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
