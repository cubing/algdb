export default {
  methods: {
    handleFiltersUpdated(filterInputs) {
      const validFilters = {}
      // only going to include non-empty filter values. will allow null and 0
      for (const prop in filterInputs) {
        if (filterInputs[prop] !== '') validFilters[prop] = filterInputs[prop]
      }

      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          ...validFilters,
        },
      })
    },
  },
}
