import sharedService from '~/services/shared'
import { executeJomql } from '~/services/jomql'
import {
  collapseObject,
  getNestedProperty,
  capitalizeString,
} from '~/services/common'

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
      return capitalizeString(this.recordInfo.type)
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

    setInputValue(key, value) {
      const inputObject = this.inputsArray.find((ele) => ele.field === key)
      if (!inputObject) throw new Error(`Input key not found: '${key}'`)

      inputObject.value = value
    },

    getInputValue(key) {
      const inputObject = this.inputsArray.find((ele) => ele.field === key)
      if (!inputObject) throw new Error(`Input key not found: '${key}'`)
      return inputObject.value
    },

    handleSearchUpdate(inputObject) {
      if (!inputObject.search || !inputObject.focused) return

      /*       // if inputObject.search === inputObject.value.name, also skip
      if (inputObject.value && inputObject.search === inputObject.value.name)
        return */

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

    handleSubmit() {
      // if any comboboxes are focused, do nothing
      if (
        Array.isArray(this.$refs.combobox) &&
        this.$refs.combobox.some((ele) => ele.isFocused)
      ) {
        return
      }
      this.submit()
    },

    async submit() {
      this.loading.editRecord = true
      try {
        const inputs = {}
        for (const inputObject of this.inputsArray) {
          let value
          // if the fieldInfo.optionsInfo.inputType === 'combobox', it came from a combo box. need to handle accordingly
          if (
            inputObject.fieldInfo.optionsInfo?.inputType === 'combobox' &&
            inputObject.fieldInfo.optionsInfo.optionsType
          ) {
            // must have non-null value
            if (!inputObject.value) {
              throw new Error(
                `Invalid input for ${
                  inputObject.fieldInfo.text ?? inputObject.field
                }`
              )
            }

            if (typeof inputObject.value === 'string') {
              // expecting either string or obj
              // create the item, get its id.
              const results = await executeJomql(this, {
                ['create' +
                capitalizeString(
                  inputObject.fieldInfo.optionsInfo.optionsType
                )]: {
                  id: true,
                  name: true,
                  __args: {
                    name: inputObject.value,
                  },
                },
              })

              // force reload of memoized options
              inputObject.fieldInfo.optionsInfo
                .getOptions(this, true)
                .then((res) => (inputObject.options = res))

              value = results.id
            } else {
              value = inputObject.value.id
            }
          } else {
            value = inputObject.value
          }

          // convert '__null' to null
          if (value === '__null') value = null

          inputs[inputObject.field] = inputObject.fieldInfo.parseValue
            ? inputObject.fieldInfo.parseValue(value)
            : value
        }

        // add mode
        let query
        if (this.mode === 'add') {
          query = {
            [this.recordInfo.addOptions.operationName ??
            'create' + this.capitalizedType]: {
              id: true,
              __args: collapseObject(inputs),
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
                fields: collapseObject(inputs),
              },
            },
          }
        }
        const data = await executeJomql(this, query)

        this.$notifier.showSnackbar({
          message:
            this.capitalizedType +
            (this.mode === 'add' ? ' Added' : ' Updated'),
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
                const fieldInfo = this.recordInfo.fields[fieldKey]
                // field unknown, abort
                if (!fieldInfo) throw new Error('Unknown field: ' + fieldKey)

                // if field is hidden, exclude
                if (fieldInfo.hidden) return total
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

          const fieldValue = fieldInfo.hidden
            ? null
            : getNestedProperty(data, fieldKey)
          const inputObject = {
            field: fieldKey,
            fieldInfo,
            value: fieldInfo.serialize
              ? fieldInfo.serialize(fieldValue)
              : fieldValue,
            options: [],
          }

          // if optionsInfo.inputType === 'server-autocomplete', only populate the options with the specific entry, if any
          if (fieldInfo.optionsInfo) {
            if (fieldInfo.optionsInfo.inputType === 'server-autocomplete') {
              executeJomql(this, {
                [`get${capitalizeString(fieldInfo.optionsInfo.optionsType)}`]: {
                  id: true,
                  name: true,
                  __args: {
                    id: inputObject.value,
                  },
                },
              })
                .then((res) => {
                  inputObject.options = [res]
                })
                .catch((e) => e)
            } else {
              fieldInfo.optionsInfo.getOptions &&
                fieldInfo.optionsInfo
                  .getOptions(this)
                  .then((res) => (inputObject.options = res))
            }
          }
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

      // set all loading to false (could have been stuck from previous operations)
      for (const prop in this.loading) {
        this.loading[prop] = false
      }

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
            loading: false,
            search: null,
            focused: false,
          }

          if (fieldInfo.optionsInfo) {
            // if server-autocomplete and readonly, load only the specific entry
            if (fieldInfo.optionsInfo.inputType === 'server-autocomplete') {
              if (inputObject.readonly) {
                executeJomql(this, {
                  [`get${capitalizeString(
                    fieldInfo.optionsInfo.optionsType
                  )}`]: {
                    id: true,
                    name: true,
                    __args: {
                      id: inputObject.value,
                    },
                  },
                })
                  .then((res) => {
                    inputObject.options = [res]
                  })
                  .catch((e) => e)
              }
            } else {
              fieldInfo.optionsInfo.getOptions &&
                fieldInfo.optionsInfo
                  .getOptions(this)
                  .then((res) => (inputObject.options = res))
            }
          }

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
