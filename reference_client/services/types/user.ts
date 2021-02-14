import type { RecordInfo } from '~/types'
import sharedService from '~/services/shared'

export default <RecordInfo<'user'>>{
  type: 'user',
  options: {
    sortBy: ['created_at'],
    sortDesc: [true],
  },
  hasSearch: true,
  filters: [],
  inputs: {
    name: {
      text: 'Name',
      addable: true,
      editable: true,
      viewable: true,
    },
    email: {
      text: 'Email',
      addable: true,
      editable: true,
      viewable: true,
    },
  },
  headers: [
    {
      text: 'Name',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    {
      text: 'Email',
      align: 'left',
      sortable: false,
      value: 'email',
      width: '150px',
    },
    {
      text: 'Role',
      align: 'left',
      sortable: true,
      value: 'role',
      width: '150px',
    },
    {
      text: 'Created At',
      align: 'left',
      sortable: true,
      value: 'created_at',
      width: '150px',
      renderFn: (val) => sharedService.generateTimeStringFromUnix(val),
    },
    {
      text: 'Updated At',
      align: 'left',
      sortable: true,
      value: 'updated_at',
      width: '150px',
      renderFn: (val) => sharedService.generateTimeStringFromUnix(val),
    },
    {
      text: 'Action',
      sortable: false,
      value: null,
      width: '90px',
    },
  ],
  addRecordComponent: null,
}
