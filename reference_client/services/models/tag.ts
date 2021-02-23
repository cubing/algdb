import algTagLinkRecordInfo from './algTagLink'
import type { RecordInfo } from '~/types'
import TimeagoColumn from '~/components/table/common/timeagoColumn.vue'

export default <RecordInfo<'tag'>>{
  type: 'tag',
  name: 'Tag',
  icon: 'mdi-tag',
  renderItem: (item) => item.name,
  options: {
    sortBy: ['created_at'],
    sortDesc: [true],
  },
  hasSearch: true,
  filters: [
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
    fields: ['name'],
  },
  editOptions: {
    fields: ['name'],
  },
  viewOptions: {
    fields: ['name'],
  },
  deleteOptions: {},
  shareOptions: {
    route: '/tags',
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
