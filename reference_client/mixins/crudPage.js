import sharedService from '~/services/shared.js'

export default {
  computed: {
    capitalizedType() {
      return sharedService.capitalizeString(this.recordInfo.type)
    },
  },

  methods: {
    handleFiltersUpdated(filterInputs) {
      // going to assume filterInputs is valid (should be)
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          ...filterInputs,
        },
      })
    },
  },

  head() {
    return {
      title: 'Manage ' + this.capitalizedType + 's',
    }
  },
}
