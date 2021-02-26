<template>
  <v-dialog v-model="status" max-width="500px" @click:outside="close()">
    <v-card>
      <v-card-title>
        <v-icon left>mdi-share-variant</v-icon>
        <span class="headline">Share {{ capitalizedType }}</span>
      </v-card-title>
      <v-card-text class="py-0">
        <v-alert v-if="selectedItem" type="info">
          {{ itemIdentifier }}
        </v-alert>
        <v-container>
          <v-row>
            <v-col xs="12" class="py-0">
              <v-text-field
                :value="shareUrl"
                label="Share URL"
                readonly
                append-icon="mdi-content-copy"
                filled
                dense
                class="py-0"
                @focus="$event.target.select()"
                @click:append="copyToClipboard(shareUrl)"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import sharedService from '~/services/shared'
import { copyToClipboard } from '~/services/common'

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
      loading: {},
    }
  },

  computed: {
    capitalizedType() {
      return sharedService.capitalizeString(this.recordInfo.type)
    },
    shareUrl() {
      return this.selectedItem && this.recordInfo.shareOptions
        ? window.location.origin +
            this.recordInfo.shareOptions.route +
            '?filters=id-eq-' +
            this.selectedItem.id
        : ''
    },
    itemIdentifier() {
      if (!this.status) return
      return this.recordInfo.renderItem
        ? this.recordInfo.renderItem(this.selectedItem)
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

    copyToClipboard(content) {
      copyToClipboard(this, content)
    },

    reset() {},
  },
}
</script>
