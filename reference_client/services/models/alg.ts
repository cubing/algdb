import { getPuzzles, getTags } from '../dropdown'
import algTagLinkRecordInfo from './algTagLink'
import algAlgcaseLinkRecordInfo from './algAlgcaseLink'
import userAlgVoteLinkRecordInfo from './userAlgVoteLink'
import algUsertagLinkRecordInfo from './algUsertagLink'
import type { RecordInfo } from '~/types'
import CurrentUserVoteColumn from '~/components/table/alg/currentUserVoteColumn.vue'
import CopyableColumn from '~/components/table/common/copyableColumn.vue'
import TimeagoColumn from '~/components/table/common/timeagoColumn.vue'

export default <RecordInfo<'alg'>>{
  type: 'alg',
  name: 'Alg',
  icon: 'mdi-view-grid',
  renderItem: (item) => item.sequence,
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
    {
      field: 'usertag.id',
      operator: 'eq',
    },
    {
      field: 'algcase.id',
      operator: 'eq',
    },
    {
      field: 'algset.id',
      operator: 'eq',
    },
    {
      field: 'id',
      operator: 'eq',
    },
  ],
  fields: {
    id: {
      text: 'ID',
    },
    sequence: {
      text: 'Sequence',
      component: CopyableColumn,
    },
    created_at: {
      text: 'Created At',
      component: TimeagoColumn,
    },
    updated_at: {
      text: 'Updated At',
      component: TimeagoColumn,
    },
    score: {
      text: 'Score',
    },
    current_user_vote: {
      text: 'My Vote',
      component: CurrentUserVoteColumn,
    },
    'algcase.id': {
      text: 'Algcase',
      parseValue: (val) => Number(val),
      optionsInfo: {
        optionsType: 'algcase',
        inputType: 'server-autocomplete',
      },
    },
    'algset.id': {
      text: 'Algset',
      parseValue: (val) => Number(val),
      optionsInfo: {
        optionsType: 'algset',
        inputType: 'server-autocomplete',
      },
    },
    'tag.id': {
      text: 'Tag',
      parseValue: (val) => Number(val),
      optionsInfo: {
        getOptions: getTags,
        optionsType: 'tag',
        inputType: 'combobox',
      },
    },
    'usertag.id': {
      text: 'User Tag',
      parseValue: (val) => Number(val),
      optionsInfo: {
        optionsType: 'usertag',
        inputType: 'server-autocomplete',
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
  deleteOptions: {},
  shareOptions: {
    route: '/algs',
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
    {
      recordInfo: algUsertagLinkRecordInfo,
      excludeHeaders: ['alg.sequence'],
    },
    {
      recordInfo: algUsertagLinkRecordInfo,
      name: 'My User Tags',
      lockedFilters: (that, item) => {
        return [
          {
            field: 'alg.id',
            operator: 'eq',
            value: item.id,
          },
          {
            field: 'created_by.id',
            operator: 'eq',
            value: that.$store.getters['auth/user']?.id,
          },
        ]
      },
      excludeHeaders: ['alg.sequence', 'created_by.name'],
    },
  ],
}
