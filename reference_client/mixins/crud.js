import sharedService from '~/services/shared.js'
import { executeJomql, executeJomqlSubscription } from '~/services/jomql.js'
import { unsubscribeChannels } from '~/services/pusher.js'
import EditRecordDialog from '~/components/dialog/editRecordDialog.vue'
import DeleteRecordDialog from '~/components/dialog/deleteRecordDialog.vue'

export default {
  components: {
    EditRecordDialog,
    DeleteRecordDialog,
  },

  props: {
    recordInfo: {
      type: Object,
      required: true,
    },
    useSubscription: {
      type: Boolean,
      default: false,
    },
    filters: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      filterInputs: {},
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
      },

      records: [],

      recordsTotal: null,

      options: {
        previousPage: null,
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
        groupBy: [],
        groupDesc: [],
        mustSort: true,
        initialLoad: true,
        positivePageDelta: true,
      },

      footerOptions: {
        'items-per-page-options': [5, 10, 25, 50],
      },
    }
  },

  computed: {
    capitalizedType() {
      return sharedService.capitalizeString(this.recordInfo.type)
    },
    validFilterParams() {
      const retObject = {}
      for (const prop in this.recordInfo.filters) {
        if (prop in this.filters && this.filters[prop] !== '') {
          this.$set(retObject, prop, this.filters[prop])
        }
      }

      return retObject
    },
  },

  watch: {
    filters() {
      this.loadData()
      this.syncFilters()
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
    generateTimeStringFromUnix: sharedService.generateTimeStringFromUnix,

    updateFilters() {
      this.$emit('filters-updated', this.filterInputs)
    },

    openAddRecordDialog() {
      this.openDialog('addRecord', this.validFilterParams)
    },

    handleUpdateOptions(options) {
      if (options.initialLoad) {
        options.initialLoad = false
      } else {
        // this.reset();
        if (options.previousPage !== options.page) {
          options.positivePageDelta = options.previousPage < options.page
          options.previousPage = options.page
        }

        this.loadData()
      }
    },

    addItem() {
      this.reset()
    },

    openDialog(dialogName, item) {
      if (dialogName in this.dialogs) {
        this.dialogs[dialogName] = true
        this.dialogs.selectedItem = item
      }
    },

    async getRecords() {
      const data = await executeJomql(
        'getMultiple' + this.capitalizedType,
        {
          paginatorInfo: {
            total: true,
          },
          data: this.recordInfo.headers.reduce(
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
        },
        {
          first: this.options.itemsPerPage,
          ...(this.options.page > 1 && {
            after: this.records[this.records.length - 1].id,
            reverse: !this.options.positivePageDelta,
          }),
          sortBy: this.options.sortBy,
          sortDesc:
            this.options.positivePageDelta === true || this.options.page === 1
              ? this.options.sortDesc
              : this.options.sortDesc.map((ele) => !ele),
          filterBy: this.validFilterParams,
        }
      )

      return data
    },

    async loadData() {
      this.loading.loadData = true
      try {
        const results = await this.getRecords()

        this.records = results.data
        this.recordsTotal = results.paginatorInfo.total
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.loadData = false
    },

    async subscribeEvents() {
      const channelName = await executeJomqlSubscription(
        this.recordInfo.type + 'ListUpdated',
        { id: true },
        {},
        (data) => {
          console.log(data)
          this.reset()
        }
      )

      this.subscriptionChannels.push(channelName)
    },

    syncFilters() {
      // Object.assign(this.filterInputs, this.filters)
      this.filterInputs = { ...this.filters }
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

        this.syncFilters()

        // populate filters
        for (const prop in this.recordInfo.filters) {
          // only set if not already set
          if (!(prop in this.filterInputs))
            this.$set(this.filterInputs, prop, null)

          // populate filter options (for dropdowns)
          if (this.recordInfo.filters[prop].getOptions) {
            this.recordInfo.filters[prop]
              .getOptions()
              .then((res) => this.$set(this.filterOptions, prop, res))
          }
        }

        // populate options
        if (this.recordInfo.options?.sortBy) {
          this.options.initialLoad = true
          this.options.sortBy = this.recordInfo.options.sortBy
          this.options.sortDesc = this.recordInfo.options.sortDesc
        }
      }

      this.loadData()
    },
  },

  head() {
    return {
      title: 'Manage ' + this.capitalizedType + 's',
    }
  },
}
