import sharedService from '~/services/shared'
import { executeJomql, executeJomqlSubscription } from '~/services/jomql'
import { unsubscribeChannels } from '~/services/pusher'
import EditRecordDialog from '~/components/dialog/editRecordDialog.vue'
import DeleteRecordDialog from '~/components/dialog/deleteRecordDialog.vue'
import CrudRecordInterface from '~/components/interface/crud/crudRecordInterface.vue'

export default {
  components: {},

  props: {
    recordInfo: {
      required: true,
    },
    useSubscription: {
      type: Boolean,
      default: false,
    },
    // raw filters that must also be in recordInfo.filters
    filters: {
      type: Array,
      default: () => [],
    },
    // raw filters that do not need to be in recordInfo.filters
    lockedFilters: {
      type: Array,
      default: () => [],
    },
    // raw filters that are applied to the addRecordDialog
    addFilters: {
      type: Array,
      default: () => [],
    },
    // array of filter keys (recordInfo.filters) that should be hidden
    hiddenFilters: {
      type: Array,
      default: () => [],
    },
    search: {
      type: String,
    },
    groupBy: {
      type: Array,
      required: false,
    },
    isChildComponent: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      filterInputs: {},
      filterInputsArray: [],
      searchInput: '',
      filterChanged: false,
      filterOptions: {},

      dialogs: {
        viewRecord: false,
        addRecord: false,
        editRecord: false,
        deleteRecord: false,

        selectedItem: null,
      },

      subscriptionChannels: [],

      loading: {
        loadData: false,
        exportData: false,
      },

      records: [],

      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
        groupBy: [],
        groupDesc: [],
        mustSort: true,
        initialLoad: true,
      },

      previousPage: null,
      positivePageDelta: true,

      nextPaginatorInfo: {
        total: null,
        startCursor: null,
        endCursor: null,
      },

      currentPaginatorInfo: {
        total: null,
        startCursor: null,
        endCursor: null,
      },

      footerOptions: {
        'items-per-page-options': [5, 10, 25, 50],
      },

      // expandable
      expandedItems: [],
      additionalSubFilters: [],
      subSearchInput: '',
    }
  },

  computed: {
    childInterfaceComponent() {
      return this.hasNested
        ? this.recordInfo.nested.interfaceComponent || CrudRecordInterface
        : null
    },

    currentAddRecordComponent() {
      return this.recordInfo.addRecordComponent || EditRecordDialog
    },
    currentEditRecordComponent() {
      return this.recordInfo.editRecordComponent || EditRecordDialog
    },
    currentDeleteRecordComponent() {
      return this.recordInfo.deleteRecordComponent || DeleteRecordDialog
    },
    currentViewRecordComponent() {
      return this.recordInfo.viewRecordComponent || EditRecordDialog
    },
    capitalizedType() {
      return sharedService.capitalizeString(this.recordInfo.type)
    },
    visibleFiltersArray() {
      return this.filterInputsArray.filter(
        (ele) => !this.hiddenFilters.includes(ele.fieldInfo.field)
      )
    },
    visibleRawFiltersArray() {
      return this.filters.filter(
        (ele) => !this.hiddenFilters.includes(ele.field)
      )
    },

    hasNested() {
      return !!this.recordInfo.nested
    },

    // expanded
    lockedSubFilters() {
      return this.expandedItems.length
        ? [
            {
              field: this.recordInfo.type.toLowerCase(),
              operator: 'eq',
              value: this.expandedItems[0].id,
            },
          ]
        : []
    },

    addSubFilters() {
      return this.lockedSubFilters
    },

    hiddenSubFilters() {
      return [this.recordInfo.type.toLowerCase()]
    },
  },

  watch: {
    filters() {
      this.syncFilters()
      this.loadData()
    },
    lockedFilters() {
      this.reset(true)
    },
  },

  created() {
    this.reset(true)
  },

  destroyed() {
    // unsubscribe from channels on this page
    if (this.useSubscription) unsubscribeChannels(this.subscriptionChannels)
  },

  methods: {
    // expanded
    handleSubFiltersUpdated(searchInput, filterInputsArray) {
      this.subSearchInput = searchInput

      // parse filterInputsArray
      this.additionalSubFilters = filterInputsArray
        .filter((ele) => ele.value !== undefined && ele.value !== null)
        .map((ele) => ({
          field: ele.fieldInfo.field,
          operator: ele.fieldInfo.operator,
          value: ele.value,
        }))
    },

    // expanded
    handleItemExpanded() {
      // when item expanded, reset the filters
      this.additionalSubFilters = []
    },

    handleRowClick(item) {
      if (this.recordInfo.handleRowClick)
        this.recordInfo.handleRowClick(this, item)
    },

    generateTimeStringFromUnix: sharedService.generateTimeStringFromUnix,

    copyToClipboard(content) {
      sharedService.copyToClipboard(this, content)
    },

    getTableRowData(headerItem, item) {
      // need to go deeper if nested
      return this.getNestedProperty(item, headerItem.value)
    },

    renderTableRowData(headerItem, item) {
      // need to go deeper if nested
      const value = this.getNestedProperty(item, headerItem.value)
      return headerItem.renderFn ? headerItem.renderFn(value) : value
    },

    getNestedProperty(obj, path) {
      const pathArray = path.split(/\./)
      let currentValue = obj
      for (const prop of pathArray) {
        // if not object, return null;
        if (!(currentValue && typeof currentValue === 'object')) {
          return null
        }
        currentValue = currentValue[prop]
      }
      return currentValue
    },

    async exportData() {
      this.loading.exportData = true
      try {
        // fetch data
        const results = await this.getRecords(false)

        const data = results.edges.map((ele) => ele.node)

        if (data.length < 1) {
          throw sharedService.generateError('No results to export')
        }

        // download as CSV
        sharedService.downloadCSV(
          this,
          data,
          'Export' + this.capitalizedType + sharedService.getCurrentDate()
        )
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.exportData = false
    },

    updateFilters() {
      this.$emit('filters-updated', this.searchInput, this.filterInputsArray)
      this.filterChanged = false
    },

    openAddRecordDialog() {
      const initializedRecord = {}

      this.addFilters.forEach((addFilter) => {
        initializedRecord[addFilter.field] = addFilter.value
      })

      console.log(initializedRecord)

      this.openDialog('addRecord', initializedRecord)
    },

    handleUpdateOptions(options) {
      if (options.initialLoad) {
        // this is here because update:options event triggers when loading the table for the first time
        options.initialLoad = false
      } else {
        // defer the action to next tick, since we possibly need to wait for handlePageReset and handleUpdatePage to complete
        this.$nextTick(this.loadData)
      }
    },

    handlePageReset() {
      // reset pageOptions
      this.previousPage = null
      this.positivePageDelta = true

      // reset paginatorInfos
      this.nextPaginatorInfo = {
        total: null,
        startCursor: null,
        endCursor: null,
      }

      this.currentPaginatorInfo = this.nextPaginatorInfo
    },

    handleUpdatePage() {
      if (this.previousPage !== this.options.page) {
        this.positivePageDelta = this.previousPage < this.options.page
        this.previousPage = this.options.page

        this.currentPaginatorInfo = this.nextPaginatorInfo
      }
    },

    openDialog(dialogName, item) {
      if (dialogName in this.dialogs) {
        this.dialogs[dialogName] = true
        this.dialogs.selectedItem = item
      }
    },

    async getRecords(paginated = true) {
      const paginationArgs = paginated
        ? {
            [this.positivePageDelta ? 'first' : 'last']: this.options
              .itemsPerPage,
            ...(this.options.page > 1 &&
              this.positivePageDelta && {
                after: this.currentPaginatorInfo.endCursor,
              }),
            ...(!this.positivePageDelta && {
              before: this.currentPaginatorInfo.startCursor,
            }),
          }
        : {
            first: 100, // first 100 rows only
          }
      const data = await executeJomql(this, {
        ['get' + this.capitalizedType + 'Paginator']: {
          paginatorInfo: {
            total: true,
            startCursor: true,
            endCursor: true,
          },
          edges: {
            node: this.recordInfo.headers.reduce(
              (total, val) => {
                // if null, skip
                if (!val.value) return total

                // if nested, process (only supporting one level of nesting)
                if (val.value.includes('.')) {
                  const parts = val.value.split(/\./)

                  if (!total[parts[0]]) {
                    total[parts[0]] = {}
                  }

                  total[parts[0]][parts[1]] = true
                } else {
                  total[val.value] = true
                }
                return total
              },
              { id: true }
            ),
            cursor: true,
          },
          __args: {
            ...paginationArgs,
            sortBy: this.options.sortBy,
            sortDesc: this.options.sortDesc,
            filterBy: this.filters
              .concat(this.lockedFilters)
              .reduce((total, ele) => {
                if (!total[ele.field]) total[ele.field] = []
                total[ele.field].push({
                  operator: ele.operator,
                  value: ele.value, // assuming this value has been parsed already
                })
                return total
              }, {}),
            ...(this.search && { search: this.search }),
            ...(this.groupBy && { groupBy: this.groupBy }),
          },
        },
      })

      return data
    },

    async loadData() {
      this.loading.loadData = true
      try {
        const results = await this.getRecords()

        this.records = results.edges.map((ele) => ele.node)

        this.nextPaginatorInfo = results.paginatorInfo
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.loadData = false
    },

    async subscribeEvents() {
      const channelName = await executeJomqlSubscription(
        this,
        {
          [this.recordInfo.type + 'ListUpdated']: {
            id: true,
            __args: {},
          },
        },
        (data) => {
          console.log(data)
          this.reset()
        }
      )

      this.subscriptionChannels.push(channelName)
    },

    syncFilters() {
      const inputFieldsSet = new Set(this.filterInputsArray)

      // parses filter into filterInputArray
      // loads the value into an existing filterInput, if one exists.
      this.filters.forEach((ele) => {
        const matchingInputObject = this.filterInputsArray.find(
          (input) =>
            input.fieldInfo.field === ele.field &&
            input.fieldInfo.operator === ele.operator
        )

        if (matchingInputObject) {
          matchingInputObject.value = ele.value

          // remove from set
          inputFieldsSet.delete(matchingInputObject)
        }
      })

      // clears any input fields with no filterObject
      inputFieldsSet.forEach((ele) => (ele.value = null))

      this.filterChanged = false
    },

    // if subscription, no need to manually reset on change
    handleListChange() {
      if (!this.useSubscription) this.reset()
    },

    reset(hardReset = false) {
      this.records = []

      if (hardReset) {
        if (this.useSubscription) this.subscribeEvents()

        // populate filters
        this.filterInputsArray = this.recordInfo.filters.map((ele) => {
          const filterObject = {
            fieldInfo: ele,
            options: [],
            value: null,
          }
          ele.getOptions &&
            ele.getOptions(this).then((res) => (filterObject.options = res))
          return filterObject
        })

        // sync filters with initial filters
        this.syncFilters()

        // populate sort/page options
        if (this.recordInfo.options?.sortBy) {
          this.options.sortBy = this.recordInfo.options.sortBy
          this.options.sortDesc = this.recordInfo.options.sortDesc
        }
      }

      this.loadData()
    },
  },
}
