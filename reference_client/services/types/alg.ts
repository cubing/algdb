import { getPuzzles, getTags } from '../dropdown'
import type { RecordInfo } from '~/types'
import sharedService from '~/services/shared'
import CreateAlgDialog from '~/components/dialog/alg/createAlgDialog.vue'

export default <RecordInfo<'alg'>>{
  type: 'alg',
  options: {
    sortBy: ['created_at'],
    sortDesc: [true],
  },
  hasSearch: true,
  filters: [
    {
      field: 'puzzle',
      operator: 'eq',
      label: 'Puzzle',
      getOptions: getPuzzles,
      parseValue: (val) => Number(val),
    },
    {
      field: 'tag',
      operator: 'eq',
      label: 'Tag',
      getOptions: getTags,
      parseValue: (val) => Number(val),
    },
  ],
  inputs: {
    sequence: {
      text: 'Sequence',
      addable: true,
      editable: true,
      viewable: true,
    },
    algcase: {
      text: 'Algcase ID',
      addable: true,
      editable: false,
      viewable: false,
      // readonly: true,
      parseValue: (val) => ({ id: val }),
    },
  },
  headers: [
    {
      text: 'Sequence',
      align: 'left',
      sortable: false,
      value: 'sequence',
    },
    {
      text: 'Score',
      align: 'left',
      sortable: false,
      value: 'score',
      width: '50px',
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
  addRecordComponent: CreateAlgDialog,
}
