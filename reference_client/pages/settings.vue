<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>User Settings</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-text-field
              v-model="inputs.name"
              label="Name"
              name="name"
              prepend-icon="mdi-account-details"
              type="text"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :loading="loading.submitting"
              @click="handleSubmit()"
              >Save Changes</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { userFragment } from '~/jomql/fragments.js'
import { executeJomql } from '~/services/jomql.js'
import sharedService from '~/services/shared.js'

export default {
  components: {},

  data() {
    return {
      inputs: {
        id: null,
        name: null,
      },

      loading: {
        submitting: false,
        loadUser: false,
      },
    }
  },

  mounted() {
    if (!this.$store.getters['auth/user']) {
      this.$router.push('/login')
    } else {
      this.reset()
    }
  },

  methods: {
    async handleSubmit() {
      this.loading.submitting = true
      try {
        const data = await executeJomql('updateUser', userFragment, {
          id: this.inputs.id,
          name: this.inputs.name,
        })

        this.$store.commit('auth/setUser', data)

        this.$notifier.showSnackbar({
          message: 'User info updated successfully',
          variant: 'success',
        })
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.submitting = false
    },

    async loadData() {
      this.loading.loadUser = true
      try {
        const data = await executeJomql('getCurrentUser', userFragment)

        this.inputs = {
          id: data.id,
          name: data.name,
        }
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.loadUser = false
    },

    reset() {
      this.loadData()
    },
  },

  head() {
    return {
      title: 'Settings',
    }
  },
}
</script>