import { getNestedProperty } from '~/services/common'

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    // could have dot notation for nested properties
    fieldpath: {
      type: String,
      required: true,
    },
  },

  computed: {
    currentValue() {
      return getNestedProperty(this.item, this.fieldpath)
    },
  },

  methods: {
    setColumnValue(value) {
      const fieldParts = this.fieldpath.split('.')
      if (fieldParts.length === 1) {
        this.item[fieldParts[0]] = value
      } else {
        const lastField = fieldParts.pop()
        getNestedProperty(this.item, fieldParts.join('.'))[lastField] = value
      }
    },
  },
}
