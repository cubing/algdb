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
            // check if there is a parser on the recordInfo.filters
            const filter = this.recordInfo.filters.find(
              (filterObject) => filterObject.field === filterParts[0]
            )

            const parseValue = filter ? filter.parseValue : null

            const value = parseValue
              ? parseValue(filterParts[2])
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
        .map(
          (ele) =>
            `${ele.fieldInfo.field}-${ele.fieldInfo.operator}-${ele.value}`
        )
        .join(',')

      this.$router.replace({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          search: searchInput,
          filters: filterString,
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
