<template>
  <div>
    <v-menu bottom left offset-x>
      <template v-slot:activator="{ on, attrs }">
        <v-icon small v-bind="attrs" v-on="on">mdi-{{ icon }}</v-icon>
      </template>

      <v-list dense>
        <v-list-item v-for="(menuItem, i) in menuItems" :key="i" dense>
          <v-icon small @click="submitVote(menuItem.value)">{{
            menuItem.icon
          }}</v-icon>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-progress-circular
      v-if="loading.submitVote"
      size="16"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<script>
import sharedService from '~/services/shared'
import { executeJomql } from '~/services/jomql'
import columnMixin from '~/mixins/column'

export default {
  mixins: [columnMixin],
  data() {
    return {
      menuItems: [
        { icon: 'mdi-thumb-up', value: 1 },
        { icon: 'mdi-null', value: 0 },
        { icon: 'mdi-thumb-down', value: -1 },
      ],

      loading: {
        submitVote: false,
      },
    }
  },

  computed: {
    icon() {
      return this.currentValue > 0
        ? 'thumb-up'
        : this.currentValue < 0
        ? 'thumb-down'
        : 'null'
    },
  },

  methods: {
    async submitVote(value) {
      this.loading.submitVote = true
      try {
        await executeJomql(this, {
          createUserAlgVoteLink: {
            __args: {
              alg: {
                id: this.item.id,
              },
              user: {
                id: this.$store.getters['auth/user'].id,
              },
              vote_value: value,
            },
          },
        })

        this.$notifier.showSnackbar({
          message: 'Vote Submitted',
          variant: 'success',
        })

        // store user's original vote value
        const originalVote = this.currentValue ?? 0

        // update the value on the item
        this.setColumnValue(value)

        // if the 'score' also exists on item, adjust it by this value
        if ('score' in this.item) {
          this.item.score += value - originalVote
        }
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.submitVote = false
    },

    reset() {},
  },
}
</script>
