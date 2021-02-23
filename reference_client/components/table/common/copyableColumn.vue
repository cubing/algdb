<template>
  <div>
    {{ currentValue }}
    <v-icon small @click.stop="copyToClipboard(currentValue)"
      >mdi-content-copy</v-icon
    >
  </div>
</template>

<script>
import { copyToClipboard } from '~/services/common'
import columnMixin from '~/mixins/column'

export default {
  mixins: [columnMixin],

  methods: {
    copyToClipboard(content) {
      copyToClipboard(this, content)
    },
  },
}
</script>
