<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Reset Password</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text nuxt to="/login">Login</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-text-field
              v-model="inputs.email"
              label="Email"
              name="email"
              prepend-icon="mdi-account"
              type="text"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :disabled="loading.submitting"
              @click="handleSubmit()"
              >Reset Password</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// import { FORGOT_PASSWORD_MUTATION } from '~/gql/mutation/auth.js'
import sharedService from '~/services/shared.js'

export default {
  middleware: 'router-auth',

  components: {},

  data() {
    return {
      inputs: {
        email: '',
      },

      loading: {
        submitting: false,
      },
    }
  },

  methods: {
    async handleSubmit() {
      this.loading.submitting = true
      try {
        const { data } = await this.$apollo.mutate({
          mutation: 'FORGOT_PASSWORD_MUTATION',
          variables: this.inputs,
        })

        this.$notifier.showSnackbar({
          message: data.forgotPassword.message,
          variant: 'success',
        })
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.submitting = false
    },
  },

  head() {
    return {
      title: 'Reset Password',
    }
  },
}
</script>
