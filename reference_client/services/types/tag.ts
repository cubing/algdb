import type { RecordInfo } from '~/types'
import sharedService from '~/services/shared'

export default <RecordInfo>{
  type: 'tag',
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
  },
  headers: [
    {
      text: 'Name',
      align: 'left',
      sortable: false,
      value: 'name',
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
}
