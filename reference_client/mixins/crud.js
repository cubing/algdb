import sharedService from '~/services/shared'
import { executeJomql, executeJomqlSubscription } from '~/services/jomql'
import { unsubscribeChannels } from '~/services/pusher'
import EditRecordDialog from '~/components/dialog/editRecordDialog.vue'
import DeleteRecordDialog from '~/components/dialog/deleteRecordDialog.vue'
import ShareRecordDialog from '~/components/dialog/shareRecordDialog.vue'
import CrudRecordInterface from '~/components/interface/crud/crudRecordInterface.vue'
import {
  collapseObject,
  getNestedProperty,
  generateTimeAgoString,
  copyToClipboard,
  capitalizeString,
} from '~/services/common'

export default {
  components: {},

  props: {
    // replacement title to override default one
    title: {
      type: String,
    },
    recordInfo: {
      required: true,
    },
    // header fields that should be hidden
    hiddenHeaders: {
      type: Array,
      default: () => [],
    },
    useSubscription: {
      type: Boolean,
      default: false,
    },
    /** raw filters that must also be in recordInfo.filters
    {
      field: string;
      operator: string;
      value: any;
    }
    */
    filters: {
      type: Array,
      default: () => [],
    },
    /** raw filters that do not need to be in recordInfo.filters. appended directly to the filterBy params. also applied to addRecordDialog
    {
      field: string;
      operator: string;
      value: any;
    }
    */
    lockedFilters: {
      type: Array,
      default: () => [],
    },
    // array of filter keys (recordInfo.filters) that should be hidden
    // string[]
    hiddenFilters: {
      type: Array,
      default: () => [],
    },
    // search term
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
      showFilterInterface: false,
      searchInput: '',
      filterChanged: false,
      filterOptions: {},

      dialogs: {
        viewRecord: false,
        addRecord: false,
        editRecord: false,
        deleteRecord: false,
        shareRecord: false,

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
      expandTypeObject: null,
    }
  },

  computed: {
    childInterfaceComponent() {
      return this.expandTypeObject
        ? this.expandTypeObject.recordInfo.interfaceComponent ||
            CrudRecordInterface
        : null
    },

    currentAddRecordComponent() {
      return this.recordInfo.addOptions?.component ?? EditRecordDialog
    },
    currentEditRecordComponent() {
      return this.recordInfo.editOptions?.component ?? EditRecordDialog
    },
    currentDeleteRecordComponent() {
      return this.recordInfo.deleteOptions?.component ?? DeleteRecordDialog
    },
    currentViewRecordComponent() {
      return this.recordInfo.viewOptions?.component ?? EditRecordDialog
    },
    currentShareRecordComponent() {
      return this.recordInfo.shareOptions?.component ?? ShareRecordDialog
    },
    capitalizedType() {
      return capitalizeString(this.recordInfo.type)
    },
    visibleFiltersArray() {
      return this.filterInputsArray.filter(
        (ele) => !this.hiddenFilters.includes(ele.field)
      )
    },
    visibleRawFiltersArray() {
      return this.filters.filter(
        (ele) => !this.hiddenFilters.includes(ele.field)
      )
    },

    headers() {
      return this.recordInfo.headers
        .filter(
          (headerObject) => !this.hiddenHeaders.includes(headerObject.field)
        )
        .map((headerObject) => {
          const fieldInfo = this.recordInfo.fields[headerObject.field]

          // field unknown, abort
          if (!fieldInfo)
            throw new Error('Unknown field: ' + headerObject.field)

          return {
            text: fieldInfo.text,
            align: headerObject.align ?? 'left',
            sortable: headerObject.sortable,
            value: headerObject.field,
            width: headerObject.width ?? null,
            renderFn: fieldInfo.renderFn,
          }
        })
        .concat({
          text: 'Action',
          sortable: false,
          value: null,
          width: '110px',
          ...this.recordInfo.headerActionOptions,
        })
    },

    hasNested() {
      return this.recordInfo.expandTypes
        ? !!this.recordInfo.expandTypes.length
        : false
    },

    // expanded
    lockedSubFilters() {
      if (!this.expandedItems.length) return []

      // is there a lockedFilters generator on the expandTypeObject? if so, use that
      if (this.expandTypeObject.lockedFilters) {
        return this.expandTypeObject.lockedFilters(this, this.expandedItems[0])
      }

      return [
        {
          field: this.recordInfo.type.toLowerCase() + '.id',
          operator: 'eq',
          value: this.expandedItems[0].id,
        },
      ]
    },

    hiddenSubFilters() {
      return [this.recordInfo.type.toLowerCase() + '.id']
    },

    visibleFiltersCount() {
      return this.visibleRawFiltersArray.length + (this.search ? 1 : 0)
    },
  },

  watch: {
    // this triggers when filters get updated on parent element
    filters() {
      this.syncFilters()
      this.reset()
      // also going to un-expand any expanded items
      this.expandedItems.pop()
    },
    // this triggers when parent element switches to a different item
    lockedFilters() {
      this.reset({
        resetSubscription: true,
        resetFilters: true,
      })
    },
  },

  created() {
    this.reset({
      resetSubscription: true,
      initFilters: true,
      resetSort: true,
    })
  },

  destroyed() {
    // unsubscribe from channels on this page
    if (this.useSubscription) unsubscribeChannels(this.subscriptionChannels)
  },

  methods: {
    generateTimeAgoString,

    handleSearchUpdate(inputObject) {
      if (!inputObject.search || !inputObject.focused) return

      // cancel pending call, if any
      clearTimeout(this._timerId)

      // delay new call 500ms
      this._timerId = setTimeout(() => {
        this.loadSearchResults(inputObject)
      }, 500)
    },

    async loadSearchResults(inputObject) {
      inputObject.loading = true
      try {
        const results = await executeJomql(this, {
          [`get${capitalizeString(
            inputObject.fieldInfo.optionsInfo.optionsType
          )}Paginator`]: {
            edges: {
              node: {
                id: true,
                name: true,
              },
            },
            __args: {
              first: 20,
              search: inputObject.search,
            },
          },
        })

        inputObject.options = results.edges.map((edge) => edge.node)
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      inputObject.loading = false
    },

    // expanded
    handleSubFiltersUpdated(searchInput, filterInputsArray) {
      this.subSearchInput = searchInput

      // parse filterInputsArray
      this.additionalSubFilters = filterInputsArray
        .filter((ele) => ele.value !== undefined && ele.value !== null)
        .map((ele) => ({
          field: ele.field,
          operator: ele.operator,
          value: ele.value,
        }))
    },

    // expanded
    toggleItemExpanded(props, expandTypeObject) {
      this.expandTypeObject = expandTypeObject

      // if switching to different expandRecordInfo when already expanded, do not toggle expand
      if (!props.isExpanded || !expandTypeObject)
        props.expand(!props.isExpanded)

      // when item expanded, reset the filters
      // this.additionalSubFilters = []
    },

    handleRowClick(item) {
      if (this.recordInfo.handleRowClick)
        this.recordInfo.handleRowClick(this, item)
    },

    copyToClipboard(content) {
      copyToClipboard(this, content)
    },

    getTableRowData(headerItem, item) {
      // need to go deeper if nested
      return getNestedProperty(item, headerItem.value)
    },

    renderTableRowData(headerItem, item) {
      // need to go deeper if nested
      const value = getNestedProperty(item, headerItem.value)
      return headerItem.renderFn ? headerItem.renderFn(value) : value
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

      this.lockedFilters.forEach((lockedFilter) => {
        initializedRecord[lockedFilter.field] = lockedFilter.value
      })

      this.openDialog('addRecord', initializedRecord)
    },

    handleUpdateOptions(options) {
      if (options.initialLoad) {
        // this is here because update:options event triggers when loading the table for the first time
        options.initialLoad = false
      } else {
        // defer the action to next tick, since we possibly need to wait for handlePageReset and handleUpdatePage to complete

        this.$nextTick(this.reset)
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
            node: collapseObject(
              this.recordInfo.headers.reduce(
                (total, headerObject) => {
                  const fieldInfo = this.recordInfo.fields[headerObject.field]

                  // field unknown, abort
                  if (!fieldInfo)
                    throw new Error('Unknown field: ' + headerObject.field)

                  total[headerObject.field] = true
                  return total
                },
                { id: true } // always add id
              )
            ),
            cursor: true,
          },
          __args: {
            ...paginationArgs,
            sortBy: this.options.sortBy,
            sortDesc: this.options.sortDesc,
            filterBy: [
              this.filters.concat(this.lockedFilters).reduce((total, ele) => {
                if (!total[ele.field]) total[ele.field] = {}
                // assuming this value has been parsed already
                total[ele.field][ele.operator] = ele.value
                return total
              }, {}),
            ],
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

    // syncs the filter values with this.filters
    syncFilters(init = false) {
      const inputFieldsSet = new Set(this.filterInputsArray)

      // parses filter into filterInputArray
      // loads the value into an existing filterInput, if one exists.
      this.filters.forEach((ele) => {
        const matchingInputObject = this.filterInputsArray.find(
          (input) =>
            input.field === ele.field && input.operator === ele.operator
        )

        if (matchingInputObject) {
          matchingInputObject.value = ele.value

          if (init) {
            // if optionsInfo.inputType === 'server-autocomplete', only populate the options with the specific entry, if any
            if (matchingInputObject.fieldInfo.optionsInfo) {
              if (
                matchingInputObject.fieldInfo.optionsInfo.inputType ===
                'server-autocomplete'
              ) {
                executeJomql(this, {
                  [`get${capitalizeString(
                    matchingInputObject.fieldInfo.optionsInfo.optionsType
                  )}`]: {
                    id: true,
                    name: true,
                    __args: {
                      id: matchingInputObject.value,
                    },
                  },
                })
                  .then((res) => {
                    matchingInputObject.options = [res]
                  })
                  .catch((e) => e)
              }
            }
          }

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

    reset({
      resetSubscription = false,
      initFilters = false,
      resetFilters = false,
      resetSort = false,
    } = {}) {
      this.records = []

      if (resetSubscription) {
        if (this.useSubscription) this.subscribeEvents()
      }

      if (initFilters) {
        this.filterInputsArray = this.recordInfo.filters.map((ele) => {
          const fieldInfo = this.recordInfo.fields[ele.field]

          // field unknown, abort
          if (!fieldInfo) throw new Error('Unknown field: ' + ele.field)

          const filterObject = {
            field: ele.field,
            fieldInfo,
            operator: ele.operator,
            options: [],
            value: null,
            loading: false,
            search: null,
            focused: false,
          }

          if (fieldInfo.optionsInfo) {
            if (fieldInfo.optionsInfo.inputType === 'server-autocomplete') {
            } else {
              fieldInfo.optionsInfo
                .getOptions(this)
                .then((res) => (filterObject.options = res))
            }
          }
          return filterObject
        })

        // clears the searchInput
        this.searchInput = ''

        // syncs the filterInputsArray with this.filters
        this.syncFilters(true)
      }

      if (resetSort) {
        this.options.initialLoad = true
        // populate sort/page options
        if (this.recordInfo.options?.sortBy) {
          this.options.sortBy = this.recordInfo.options.sortBy
          this.options.sortDesc = this.recordInfo.options.sortDesc
        }
      }

      // sets all of the filter values to null, searchInput to '' and also emits changes to parent
      if (resetFilters) {
        this.filterInputsArray.forEach((ele) => {
          ele.value = null
        })
        // clears the searchInput
        this.searchInput = ''
        this.updateFilters()

        // returning early because updateFilters will trigger reset
        return
      }

      this.loadData()
    },
  },
}
