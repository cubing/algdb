import sharedService from '~/services/shared'
import { executeJomql } from '~/services/jomql'
import { collapseObject, getNestedProperty } from '~/services/common'

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

    // must be add, edit, or view
    mode: {
      type: String,
      required: true,
      validator: (value) => {
        return ['add', 'edit', 'view'].includes(value)
      },
    },
  },
  data() {
    return {
      inputsArray: [],

      // inputs that are used for scaffolding
      miscInputs: null,
      originalMiscInputs: {},

      // loaded from loadMiscDropdowns, if provided
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
        (this.mode === 'add' ? 'New' : this.mode === 'edit' ? 'Edit' : 'View') +
        ' ' +
        this.capitalizedType
      )
    },
    icon() {
      return this.mode === 'add'
        ? 'mdi-plus'
        : this.mode === 'edit'
        ? 'mdi-pencil'
        : 'mdi-eye'
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
        const inputs = collapseObject(
          this.inputsArray.reduce((total, inputObject) => {
            total[inputObject.field] = inputObject.fieldInfo.parseValue
              ? inputObject.fieldInfo.parseValue(inputObject.value)
              : inputObject.value
            return total
          }, {})
        )

        // add mode
        let query
        if (this.mode === 'add') {
          query = {
            [this.recordInfo.addOptions.operationName ??
            'create' + this.capitalizedType]: {
              id: true,
              __args: inputs,
            },
          }
        } else {
          query = {
            [this.recordInfo.editOptions.operationName ??
            'update' + this.capitalizedType]: {
              id: true,
              __args: {
                item: {
                  id: this.selectedItem.id,
                },
                fields: inputs,
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
        const fields =
          this.mode === 'edit'
            ? this.recordInfo.editOptions.fields
            : this.recordInfo.viewOptions.fields
        const data = await executeJomql(this, {
          ['get' + this.capitalizedType]: {
            ...collapseObject(
              fields.reduce((total, fieldKey) => {
                total[fieldKey] = true
                return total
              }, {})
            ),
            __args: {
              id: this.selectedItem.id,
            },
          },
        })

        // serialize any fields if necessary

        this.inputsArray = fields.map((fieldKey) => {
          const fieldInfo = this.recordInfo.fields[fieldKey]

          // field unknown, abort
          if (!fieldInfo) throw new Error('Unknown field: ' + fieldKey)

          const fieldValue = getNestedProperty(data, fieldKey)
          const inputObject = {
            field: fieldKey,
            fieldInfo,
            value: fieldInfo.serialize
              ? fieldInfo.serialize(fieldValue)
              : fieldValue,
            options: [],
          }

          fieldInfo.getOptions &&
            fieldInfo
              .getOptions(this)
              .then((res) => (inputObject.options = res))

          return inputObject
        })
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.loadRecord = false
    },

    loadDropdowns() {
      this.loading.loadDropdowns = true

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
      if (this.mode === 'add') {
        this.inputsArray = this.recordInfo.addOptions.fields.map((fieldKey) => {
          const fieldInfo = this.recordInfo.fields[fieldKey]

          // field unknown, abort
          if (!fieldInfo) throw new Error('Unknown field: ' + fieldKey)

          let value
          let readonly = false

          // is the field in selectedItem? if so, use that and set field to readonly
          if (fieldKey in this.selectedItem) {
            value = this.selectedItem[fieldKey]
            readonly = true
          } else {
            value = fieldInfo.default ? fieldInfo.default(this) : null
          }

          const inputObject = {
            field: fieldKey,
            fieldInfo,
            value,
            options: [],
            readonly,
          }

          fieldInfo.getOptions &&
            fieldInfo
              .getOptions(this)
              .then((res) => (inputObject.options = res))

          return inputObject
        })
      } else {
        this.loadRecord()
      }

      if (hardReset) {
      }
    },
  },
}
