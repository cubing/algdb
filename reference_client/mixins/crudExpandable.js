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
            ...this.additionalSubFilter,
          }
        : {}
    },
  },

  methods: {
    handleFiltersUpdated(filterInputs) {
      const validFilters = {}
      // only going to include non-empty filter values. will allow null
      for (const prop in filterInputs) {
        if (filterInputs[prop] !== '') validFilters[prop] = filterInputs[prop]
      }

      this.additionalSubFilter = validFilters
    },

    handleItemExpanded() {
      // when item expanded, reset the filters
      this.additionalSubFilter = null
    },
  },
}
