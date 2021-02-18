import sharedService from '~/services/shared'
import { executeJomql, executeJomqlSubscription } from '~/services/jomql'
import { unsubscribeChannels } from '~/services/pusher'
import EditRecordDialog from '~/components/dialog/editRecordDialog.vue'
import DeleteRecordDialog from '~/components/dialog/deleteRecordDialog.vue'
import CrudRecordInterface from '~/components/interface/crud/crudRecordInterface.vue'
import {
  collapseObject,
  getNestedProperty,
  generateTimeAgoString,
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
          width: '90px',
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
      return this.expandedItems.length
        ? [
            {
              field: this.recordInfo.type.toLowerCase() + '.id',
              operator: 'eq',
              value: this.expandedItems[0].id,
            },
          ]
        : []
    },

    hiddenSubFilters() {
      return [this.recordInfo.type.toLowerCase()]
    },
  },

  watch: {
    // this triggers when filters get updated on parent element
    filters() {
      // doing something between a soft and hard reset
      this.syncFilters()
      this.loadData()
      // also going to un-expand any expanded items
      this.expandedItems.pop()
    },
    // this triggers when parent element switches to a different item
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
    generateTimeAgoString,

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
      sharedService.copyToClipboard(this, content)
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

    syncFilters() {
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

        this.options.initialLoad = true

        // populate filters
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
          }
          fieldInfo.getOptions &&
            fieldInfo
              .getOptions(this)
              .then((res) => (filterObject.options = res))
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
