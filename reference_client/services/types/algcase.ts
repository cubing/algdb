import type { RecordInfo } from '~/types'
import sharedService from '~/services/shared'
import algRecordInfo from '~/services/types/alg'

export default <RecordInfo>{
  type: 'algcase',
  options: {
    sortBy: ['created_at'],
    sortDesc: [true],
  },
  hasSearch: true,
  filters: [
    {
      field: 'algset',
      label: 'Algset ID',
      operator: 'eq',
    },
  ],
  inputs: {
    name: {
      text: 'Name',
      addable: true,
      editable: true,
      viewable: true,
    },
    algset: {
      text: 'Algset ID',
      addable: true,
      editable: false,
      viewable: false,
      parseValue: (val) => (val === null ? null : { id: val }),
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
  nested: algRecordInfo,
}
