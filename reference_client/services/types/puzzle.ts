import type { RecordInfo } from '~/types'
import sharedService from '~/services/shared'
import algsetRecordInfo from '~/services/types/algset'
import { getBooleanOptions } from '~/services/dropdown'

export default <RecordInfo>{
  type: 'puzzle',
  options: {
    sortBy: ['created_at'],
    sortDesc: [true],
  },
  hasSearch: true,
  filters: [
    {
      field: 'is_public',
      label: 'Is Public',
      operator: 'eq',
      getOptions: getBooleanOptions,
      parseValue: (val) => (typeof val === 'boolean' ? val : val === 'true'),
    },
  ],
  inputs: {
    name: {
      text: 'Name',
      addable: true,
      editable: true,
      viewable: true,
    },
    code: {
      text: 'Code',
      addable: true,
      editable: true,
      viewable: true,
    },
    is_public: {
      text: 'Public',
      addable: true,
      editable: true,
      viewable: true,
      getOptions: getBooleanOptions,
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
      text: 'Code',
      align: 'left',
      sortable: false,
      value: 'code',
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
  nested: algsetRecordInfo,
}
