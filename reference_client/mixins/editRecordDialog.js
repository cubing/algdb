import sharedService from '~/services/shared'
import { executeJomql } from '~/services/jomql'

export default {
  props: {
    status: {
      type: Boolean,
    },

    selectedItem: {
      type: Object,
      default: () => ({}),
    },

    recordInfo: {
      type: Object,
      required: true,
    },

    addMode: {
      type: Boolean,
      default: false,
    },

    viewMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputs: {},

      inputOptions: {},

      // inputs that are used for scaffolding
      miscInputs: null,
      originalMiscInputs: {},

      miscOptions: {},

      loading: {
        editRecord: false,
        loadRecord: false,
        loadDropdowns: false,
      },
    }
  },

  computed: {
    capitalizedType() {
      return sharedService.capitalizeString(this.recordInfo.type)
    },
    title() {
      return (
        (this.addMode ? 'New' : this.viewMode ? 'View' : 'Edit') +
        ' ' +
        this.capitalizedType
      )
    },
    icon() {
      return this.addMode
        ? 'mdi-plus'
        : this.viewMode
        ? 'mdi-eye'
        : 'mdi-pencil'
    },
    validInputs() {
      const returnObject = {}
      for (const prop in this.recordInfo.inputs) {
        if (
          this.recordInfo.inputs[prop][
            this.addMode ? 'addable' : this.viewMode ? 'viewable' : 'editable'
          ]
        ) {
          returnObject[prop] = this.recordInfo.inputs[prop]
        }
      }
      return returnObject
    },
  },

  watch: {
    status() {
      this.reset(true)
    },
  },

  created() {
    this.miscInputs = JSON.parse(JSON.stringify(this.originalMiscInputs))
  },

  methods: {
    close() {
      this.$emit('close')
    },

    async submit() {
      this.loading.editRecord = true
      try {
        // identify inputs that need to be overwritten (due to entity)
        const overwriteInputs = {}
        for (const prop in this.inputs) {
          const parsevalueFn = this.recordInfo.inputs[prop]?.parseValue
          if (parsevalueFn) {
            overwriteInputs[prop] = parsevalueFn(this.inputs[prop])
          }
        }

        // add mode
        let query
        if (this.addMode) {
          query = {
            ['create' + this.capitalizedType]: {
              id: true,
              __args: {
                ...this.inputs,
                ...overwriteInputs,
              },
            },
          }
        } else {
          query = {
            ['update' + this.capitalizedType]: {
              id: true,
              __args: {
                item: {
                  id: this.selectedItem.id,
                },
                fields: {
                  ...this.inputs,
                  ...overwriteInputs,
                },
              },
            },
          }
        }
        const data = await executeJomql(this, query)

        this.$notifier.showSnackbar({
          message:
            this.capitalizedType + (this.addMode ? ' Added' : ' Updated'),
          variant: 'success',
        })

        this.$emit('submit', data)

        this.close()
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.editRecord = false
    },

    async loadRecord() {
      this.loading.loadRecord = true
      try {
        const data = await executeJomql(this, {
          ['get' + this.capitalizedType]: {
            id: true,
            ...Object.keys(this.validInputs).reduce((total, key) => {
              // exclude if view mode and not viewable
              if (!this.validInputs[key].viewable) return total

              total[key] = true
              return total
            }, {}),
            __args: {
              id: this.selectedItem.id,
            },
          },
        })

        this.inputs = {
          ...Object.keys(this.validInputs).reduce((total, key) => {
            const serializeFn = this.recordInfo.inputs[key]?.serialize

            total[key] = serializeFn ? serializeFn(data[key]) : data[key]

            return total
          }, {}),
        }
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.loadRecord = false
    },

    async loadDropdowns() {
      this.loading.loadDropdowns = true
      for (const prop in this.recordInfo.inputs) {
        // only set it if not already set
        if (
          this.recordInfo.inputs[prop].getOptions &&
          !this.inputOptions[prop]
        ) {
          const data = await this.recordInfo.inputs[prop].getOptions(this)
          this.$set(this.inputOptions, prop, data)
        }
      }

      // load any other misc dropdowns
      this.loadMiscDropdowns && this.loadMiscDropdowns()

      this.loading.loadDropdowns = false
    },

    reset(hardReset = false) {
      if (!this.status) return

      // duplicate misc inputs, if any
      this.miscInputs = JSON.parse(JSON.stringify(this.originalMiscInputs))

      // load dropdowns in this.inputOptions
      this.loadDropdowns()

      // initialize inputs
      if (this.addMode) {
        this.inputs = {
          ...Object.keys(this.recordInfo.inputs).reduce((total, key) => {
            total[key] = this.recordInfo.inputs[key].default
              ? this.recordInfo.inputs[key].default()
              : null
            return total
          }, {}),
          ...this.selectedItem,
        }
      } else {
        this.loadRecord()
      }

      if (hardReset) {
      }
    },
  },
}
