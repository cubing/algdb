import sharedService from '~/services/shared'
import CrudRecordInterface from '~/components/interface/crud/crudRecordInterface.vue'

export default {
  computed: {
    interfaceComponent() {
      return this.recordInfo.interfaceComponent || CrudRecordInterface
    },

    capitalizedType() {
      return sharedService.capitalizeString(this.recordInfo.type)
    },

    // parses the query params and transforms into raw filterArray
    filters() {
      const filterArray = []
      if (this.$route.query.filters) {
        this.$route.query.filters.split(',').forEach((ele) => {
          const filterParts = ele.split('-')
          if (filterParts.length === 3) {
            const filter = this.recordInfo.filters.find(
              (filterObject) => filterObject.field === filterParts[0]
            )

            // check if there is a parser on the fieldInfo
            const fieldInfo = this.recordInfo.fields[filter.field]

            // field unknown, abort
            if (!fieldInfo) throw new Error('Unknown field: ' + filter.field)

            const value = fieldInfo.parseValue
              ? fieldInfo.parseValue(filterParts[2])
              : filterParts[2]
            filterArray.push({
              field: filterParts[0],
              operator: filterParts[1],
              value,
            })
          }
        })
      }
      return filterArray
    },
  },

  methods: {
    handleFiltersUpdated(searchInput, filterInputsArray) {
      // build filter string
      const filterString = filterInputsArray
        .filter((ele) => ele.value !== undefined && ele.value !== null)
        .map((ele) => `${ele.field}-${ele.operator}-${ele.value}`)
        .join(',')

      const query = {
        ...this.$route.query,
        search: searchInput,
        filters: filterString,
      }

      if (!searchInput) {
        delete query.search
      }

      if (!filterString) {
        delete query.filters
      }

      this.$router.replace({
        path: this.$route.path,
        query,
      })
    },
  },

  head() {
    return {
      title: 'Manage ' + this.capitalizedType + 's',
    }
  },
}
