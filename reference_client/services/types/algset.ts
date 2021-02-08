import type { RecordInfo } from '~/types'
import sharedService from '~/services/shared'
import {
  getPuzzles,
  getBooleanOptions,
  getCaseVisualizations,
} from '~/services/dropdown'
import algcaseRecordInfo from '~/services/types/algcase'
import CrudAlgsetInterface from '~/components/interface/crud/crudAlgsetInterface.vue'

export default <RecordInfo>{
  type: 'algset',
  options: {
    sortBy: ['created_at'],
    sortDesc: [true],
  },
  hasSearch: true,
  filters: [
    {
      field: 'puzzle',
      label: 'Puzzle',
      operator: 'eq',
      getOptions: getPuzzles,
    },
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
    mask: {
      text: 'Mask',
      addable: true,
      editable: true,
      viewable: true,
    },
    visualization: {
      text: 'Visualization',
      addable: true,
      editable: true,
      viewable: true,
      getOptions: getCaseVisualizations,
    },
    is_public: {
      text: 'Public',
      addable: true,
      editable: true,
      viewable: true,
      getOptions: getBooleanOptions,
    },
    puzzle: {
      text: 'Puzzle ID',
      addable: true,
      editable: false,
      viewable: false,
      readonly: true,
      parseValue: (val) => (val === null ? null : { id: val }),
    },
    parent: {
      text: 'Parent Algset ID',
      addable: true,
      editable: false,
      viewable: false,
      readonly: true,
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
      width: '110px',
    },
  ],
  nested: algcaseRecordInfo,
  interfaceComponent: CrudAlgsetInterface,
}
