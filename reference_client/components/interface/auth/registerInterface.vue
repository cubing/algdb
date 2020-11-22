<template>
  <v-card>
    <v-card-text>
      <v-text-field
        v-model="inputs.name"
        label="Name"
        name="name"
        prepend-icon="mdi-account-details"
        type="text"
      ></v-text-field>

      <v-text-field
        v-model="inputs.email"
        label="Email"
        name="login"
        prepend-icon="mdi-account"
        type="text"
      ></v-text-field>

      <v-text-field
        id="password"
        v-model="inputs.password"
        label="Password"
        name="password"
        prepend-icon="mdi-lock"
        type="password"
      ></v-text-field>
      <v-text-field
        id="passwordconfirm"
        v-model="inputs.password_confirmation"
        label="Password Confirmation"
        name="passwordconfirm"
        prepend-icon="mdi-lock"
        type="password"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        :loading="loading.submitting"
        @click="handleSubmit()"
        >Create Account</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { REGISTER_MUTATION } from '~/jomql/mutation/auth.js'
import { executeJomql } from '~/services/jomql.js'
import sharedService from '~/services/shared.js'
import authService from '~/services/auth.js'

export default {
  components: {},

  data() {
    return {
      inputs: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
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
        if (this.inputs.password !== this.inputs.password_confirmation) {
          throw sharedService.generateError('Password fields must match')
        }

        const data = await executeJomql(
          'registerUser',
          REGISTER_MUTATION,
          this.inputs
        )

        await authService.handleLogin(this, data)

        this.$emit('login-success')
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.submitting = false
    },
  },
}
</script>
