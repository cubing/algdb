import crudMixin from '~/mixins/crud.js'

export default {
  mixins: [crudMixin],

  data() {
    return {
      expandedItems: [],
      additionalSubFilter: null,
    }
  },

  computed: {
    subFilter() {
      return this.expandedItems.length
        ? {
            [this.recordInfo.type.toLowerCase()]: this.expandedItems[0].id,
            ...this.hiddenSubFilters,
            ...this.additionalSubFilter,
          }
        : {}
    },

    hiddenSubFilters() {
      return this.expandedItems.length
        ? {
            [this.recordInfo.type.toLowerCase()]: this.expandedItems[0].id,
          }
        : {}
    },
  },

  methods: {
    handleFiltersUpdated(filterInputs) {
      // going to assume filterInputs is valid (should be)
      this.additionalSubFilter = filterInputs
    },

    handleItemExpanded() {
      // when item expanded, reset the filters
      this.additionalSubFilter = null
    },
  },
}
