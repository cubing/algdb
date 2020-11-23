import {
  getCaseVisualizations,
  getBooleanOptions,
} from '~/services/dropdown.js'

export const puzzleRecordInfo = {
  type: 'puzzle',
  filters: {
    search: {
      label: 'Search',
      icon: 'mdi-magnify',
    },
  },
  inputs: {
    name: {
      text: 'Name',
      addable: true,
      editable: true,
    },
    code: {
      text: 'Code',
      addable: true,
      editable: true,
    },
    is_public: {
      text: 'Public',
      addable: true,
      editable: true,
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
    },
    {
      text: 'Updated At',
      align: 'left',
      sortable: true,
      value: 'updated_at',
      width: '150px',
    },
    {
      text: 'Action',
      sortable: false,
      value: null,
      width: '90px',
    },
  ],
}

export const algsetRecordInfo = {
  type: 'algset',
  filters: {
    search: {
      label: 'Search',
      icon: 'mdi-magnify',
    },
    puzzle: {
      label: 'Puzzle',
      icon: null,
    },
    parent: {
      label: 'Parent Algset',
      icon: null,
    },
  },
  inputs: {
    name: {
      text: 'Name',
      addable: true,
      editable: true,
    },
    code: {
      text: 'Code',
      addable: true,
      editable: true,
    },
    mask: {
      text: 'Mask',
      addable: true,
      editable: true,
    },
    visualization: {
      text: 'Visualization',
      addable: true,
      editable: true,
      getOptions: getCaseVisualizations,
    },
    is_public: {
      text: 'Public',
      addable: true,
      editable: true,
      getOptions: getBooleanOptions,
    },
    puzzle: {
      text: 'Puzzle ID',
      addable: true,
      editable: true,
      readonly: true,
    },
    parent: {
      text: 'Parent Algset ID',
      addable: true,
      editable: true,
      readonly: true,
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
      sortable: true,
      value: 'code',
      width: '150px',
    },
    {
      text: 'Created At',
      align: 'left',
      sortable: true,
      value: 'created_at',
      width: '150px',
    },
    {
      text: 'Updated At',
      align: 'left',
      sortable: true,
      value: 'updated_at',
      width: '150px',
    },
    {
      text: 'Action',
      sortable: false,
      value: null,
      width: '110px',
    },
  ],
}

export const algcaseRecordInfo = {
  type: 'algcase',
  filters: {
    search: {
      label: 'Search',
      icon: 'mdi-magnify',
    },
    algset: {
      label: 'Algset',
      icon: null,
    },
  },
  inputs: {
    name: {
      text: 'Name',
      addable: true,
      editable: true,
    },
    algset: {
      text: 'Algset ID',
      addable: true,
      editable: true,
      readonly: true,
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
    },
    {
      text: 'Updated At',
      align: 'left',
      sortable: true,
      value: 'updated_at',
      width: '150px',
    },
    {
      text: 'Action',
      sortable: false,
      value: null,
      width: '90px',
    },
  ],
}

export const algRecordInfo = {
  type: 'alg',
  filters: {
    search: {
      label: 'Search',
      icon: 'mdi-magnify',
    },
    algcase: {
      label: 'Algcase',
      icon: null,
    },
  },
  inputs: {
    sequence: {
      text: 'Sequence',
      addable: true,
      editable: true,
    },
    algcase: {
      text: 'Algcase ID',
      addable: true,
      editable: true,
      readonly: true,
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
      text: 'Created At',
      align: 'left',
      sortable: true,
      value: 'created_at',
      width: '150px',
    },
    {
      text: 'Updated At',
      align: 'left',
      sortable: true,
      value: 'updated_at',
      width: '150px',
    },
    {
      text: 'Action',
      sortable: false,
      value: null,
      width: '90px',
    },
  ],
}
