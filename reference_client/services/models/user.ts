import userAlgVoteLinkRecordInfo from './userAlgVoteLink'
import algRecordInfo from './alg'
import algUsertagLinkRecordInfo from './algUsertagLink'
import type { RecordInfo } from '~/types'
import { generateTimeAgoString } from '~/services/common'
import { getUserRoles } from '~/services/dropdown'

export default <RecordInfo<'user'>>{
  type: 'user',
  name: 'User',
  icon: 'mdi-account',
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
  ],
  fields: {
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
      renderFn: (val) => generateTimeAgoString(val),
    },
    updated_at: {
      text: 'Updated At',
      renderFn: (val) => generateTimeAgoString(val),
    },
  },
  addOptions: undefined,
  editOptions: {
    fields: ['name', 'role'],
  },
  viewOptions: {
    fields: ['name', 'email', 'role'],
  },
  deleteOptions: {
    renderItem: (item) => item.email,
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
