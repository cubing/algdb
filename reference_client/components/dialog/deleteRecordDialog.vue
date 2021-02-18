<template>
  <v-dialog v-model="status" max-width="500px" @click:outside="close()">
    <v-card>
      <v-card-title>
        <v-icon left>mdi-delete</v-icon>
        <span class="headline">Delete {{ capitalizedType }}</span>
      </v-card-title>
      <v-card-text class="py-0">
        <v-alert v-if="selectedItem" type="error">
          Confirm Delete: {{ itemIdentifier }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn
          color="error"
          text
          :loading="loading.deleteRecord"
          @click="deleteRecord()"
          >Delete</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
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
  },
  data() {
    return {
      loading: {
        deleteRecord: false,
      },
    }
  },

  computed: {
    capitalizedType() {
      return sharedService.capitalizeString(this.recordInfo.type)
    },
    itemIdentifier() {
      if (!this.status) return
      return this.recordInfo.deleteOptions.renderItem
        ? this.recordInfo.deleteOptions.renderItem(this.selectedItem)
        : this.selectedItem
    },
  },

  watch: {
    status() {
      if (this.status) {
        this.reset()
      }
    },
  },

  methods: {
    close() {
      this.$emit('close')
    },

    async deleteRecord() {
      this.loading.deleteRecord = true
      try {
        const data = await executeJomql(this, {
          [this.recordInfo.deleteOptions.operationName ??
          'delete' + this.capitalizedType]: {
            id: true,
            __args: {
              id: this.selectedItem.id,
            },
          },
        })

        this.$notifier.showSnackbar({
          message: this.capitalizedType + ' Deleted',
          variant: 'success',
        })

        this.$emit('submit', data)

        this.close()
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.deleteRecord = false
    },

    reset() {},
  },
}
</script>
