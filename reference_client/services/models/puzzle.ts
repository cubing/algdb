import type { RecordInfo } from '~/types'
import algsetRecordInfo from '~/services/models/algset'
import { getBooleanOptions } from '~/services/dropdown'
import TimeagoColumn from '~/components/table/common/timeagoColumn.vue'

export default <RecordInfo<'puzzle'>>{
  type: 'puzzle',
  name: 'Puzzle',
  icon: 'mdi-view-grid',
  renderItem: (item) => item.name,
  options: {
    sortBy: ['created_at'],
    sortDesc: [true],
  },
  hasSearch: true,
  filters: [
    {
      field: 'is_public',
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
    code: {
      text: 'Code',
    },
    is_public: {
      text: 'Public',
      optionsInfo: {
        getOptions: getBooleanOptions,
        inputType: 'select',
      },
      parseValue: (val) => (typeof val === 'boolean' ? val : val === 'true'),
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
    fields: ['name', 'code', 'is_public'],
  },
  editOptions: {
    fields: ['name', 'code', 'is_public'],
  },
  viewOptions: {
    fields: ['name', 'code', 'is_public'],
  },
  deleteOptions: {},
  shareOptions: {
    route: '/puzzles',
  },
  headers: [
    {
      field: 'name',
      sortable: false,
    },
    {
      field: 'code',
      sortable: false,
      width: '150px',
    },
    {
      field: 'created_at',
      sortable: true,
      width: '150px',
    },
    {
      field: 'updated_at',
      sortable: true,
      width: '150px',
    },
  ],
  expandTypes: [
    {
      recordInfo: algsetRecordInfo,
      // this will be manipulated when navigating to parent/child nodes, and should not be visible to the user as a nested interface
      excludeFilters: ['parent.id'],
      initialFilters: [
        {
          field: 'parent.id',
          operator: 'eq',
          value: '__null',
        },
      ],
    },
  ],
}
