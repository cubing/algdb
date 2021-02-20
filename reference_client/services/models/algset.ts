import type { RecordInfo } from '~/types'
import {
  getPuzzles,
  getBooleanOptions,
  getCaseVisualizations,
} from '~/services/dropdown'
import algcaseRecordInfo from '~/services/models/algcase'
import CrudAlgsetInterface from '~/components/interface/crud/crudAlgsetInterface.vue'
import { generateTimeAgoString } from '~/services/common'

export default <RecordInfo<'algset'>>{
  type: 'algset',
  name: 'Algset',
  options: {
    sortBy: ['created_at'],
    sortDesc: [true],
  },
  hasSearch: true,
  filters: [
    {
      field: 'puzzle.id',
      operator: 'eq',
    },
    {
      field: 'is_public',
      operator: 'eq',
    },
  ],
  fields: {
    name: {
      text: 'Name',
    },
    code: {
      text: 'Code',
    },
    score: {
      text: 'Score',
    },
    is_public: {
      text: 'Public',
      optionsInfo: {
        getOptions: getBooleanOptions,
        inputType: 'select',
      },
      parseValue: (val) => (typeof val === 'boolean' ? val : val === 'true'),
    },
    mask: {
      text: 'Mask',
    },
    visualization: {
      text: 'Visualization',
      optionsInfo: {
        getOptions: getCaseVisualizations,
        inputType: 'select',
      },
    },
    'puzzle.id': {
      text: 'Puzzle',
      parseValue: (val) => Number(val),
      optionsInfo: {
        getOptions: getPuzzles,
        optionsType: 'puzzle',
        inputType: 'autocomplete',
      },
    },
    'parent.id': {
      text: 'Parent Algset ID',
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
  addOptions: {
    fields: [
      'name',
      'code',
      'is_public',
      'mask',
      'visualization',
      'puzzle.id',
      'parent.id',
    ],
  },
  editOptions: {
    fields: ['name', 'code', 'is_public', 'mask', 'visualization', 'puzzle.id'],
  },
  viewOptions: {
    fields: [
      'name',
      'code',
      'is_public',
      'mask',
      'visualization',
      'puzzle.id',
      'parent.id',
    ],
  },
  deleteOptions: {
    renderItem: (item) => item.name,
  },
  headers: [
    {
      field: 'name',
      sortable: false,
    },
    {
      field: 'score',
      width: '50px',
      sortable: false,
    },
    {
      field: 'code',
      width: '150px',
      sortable: false,
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
  headerActionOptions: {
    width: '110px',
  },
  expandTypes: [
    {
      recordInfo: algcaseRecordInfo,
    },
  ],
  interfaceComponent: CrudAlgsetInterface,
}
