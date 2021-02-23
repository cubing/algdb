import userAlgVoteLinkRecordInfo from './userAlgVoteLink'
import algRecordInfo from './alg'
import algUsertagLinkRecordInfo from './algUsertagLink'
import type { RecordInfo } from '~/types'
import TimeagoColumn from '~/components/table/common/timeagoColumn.vue'
import { getUserRoles } from '~/services/dropdown'

export default <RecordInfo<'user'>>{
  type: 'user',
  name: 'User',
  icon: 'mdi-account',
  renderItem: (item) => item.email,
  options: {
    sortBy: ['created_at'],
    sortDesc: [true],
  },
  hasSearch: true,
  filters: [
    {
      field: 'role',
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
    email: {
      text: 'Email',
    },
    role: {
      text: 'User Role',
      optionsInfo: {
        getOptions: getUserRoles,
        inputType: 'select',
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
  },
  addOptions: undefined,
  editOptions: {
    fields: ['name', 'role'],
  },
  viewOptions: {
    fields: ['name', 'email', 'role'],
  },
  deleteOptions: {},
  shareOptions: {
    route: '/users',
  },
  headers: [
    {
      field: 'name',
      sortable: false,
    },
    {
      field: 'email',
      sortable: false,
      width: '150px',
    },
    {
      field: 'role',
      sortable: true,
      width: '150px',
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
      recordInfo: userAlgVoteLinkRecordInfo,
      name: 'Voted Algs',
      excludeHeaders: ['user.name'],
    },
    {
      recordInfo: algRecordInfo,
      name: 'Created Algs',
      lockedFilters: (_that, item) => {
        return [
          {
            field: 'created_by.id',
            operator: 'eq',
            value: item.id,
          },
        ]
      },
    },
    {
      recordInfo: algUsertagLinkRecordInfo,
      name: "User's Tags",
      lockedFilters: (_that, item) => {
        return [
          {
            field: 'created_by.id',
            operator: 'eq',
            value: item.id,
          },
        ]
      },
      excludeHeaders: ['created_by.name'],
    },
  ],
}
