import { getPuzzles, getTags } from '../dropdown'
import algTagLinkRecordInfo from './algTagLink'
import algAlgcaseLinkRecordInfo from './algAlgcaseLink'
import userAlgVoteLinkRecordInfo from './userAlgVoteLink'
import type { RecordInfo } from '~/types'
import { generateTimeAgoString } from '~/services/common'

export default <RecordInfo<'alg'>>{
  type: 'alg',
  name: 'Alg',
  icon: 'mdi-view-grid',
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
      field: 'tag.id',
      operator: 'eq',
    },
  ],
  fields: {
    sequence: {
      text: 'Sequence',
    },
    created_at: {
      text: 'Created At',
      renderFn: (val) => generateTimeAgoString(val),
    },
    updated_at: {
      text: 'Updated At',
      renderFn: (val) => generateTimeAgoString(val),
    },
    score: {
      text: 'Score',
    },
    current_user_vote: {
      text: 'My Vote',
    },
    'algcase.id': {
      text: 'Algcase ID',
    },
    'tag.id': {
      text: 'Tag',
      parseValue: (val) => Number(val),
      getOptions: getTags,
    },
    'puzzle.id': {
      text: 'Puzzle ID',
      parseValue: (val) => Number(val),
      getOptions: getPuzzles,
    },
  },
  addOptions: {
    fields: ['sequence', 'algcase.id'],
    operationName: 'createAndLinkAlg',
  },
  editOptions: {
    fields: ['sequence'],
  },
  viewOptions: {
    fields: ['sequence'],
  },
  deleteOptions: {
    renderItem: (item) => item.sequence,
  },
  headers: [
    {
      field: 'sequence',
      sortable: false,
    },
    {
      field: 'current_user_vote',
      sortable: false,
      width: '100px',
    },
    {
      field: 'score',
      sortable: false,
      width: '50px',
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
      recordInfo: algTagLinkRecordInfo,
      excludeHeaders: ['alg.sequence'],
    },
    {
      recordInfo: algAlgcaseLinkRecordInfo,
      excludeHeaders: ['alg.sequence'],
    },
    {
      recordInfo: userAlgVoteLinkRecordInfo,
      excludeHeaders: ['alg.sequence'],
    },
  ],
}
