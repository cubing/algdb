<template>
  <v-card>
    <v-card-text>
      <v-text-field
        v-model="inputs.email"
        label="Login"
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
        @keyup.enter="handleSubmit()"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn text nuxt to="/password-reset">Password Forgotten</v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        :loading="loading.submitting"
        @click="handleSubmit()"
        >Login</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { LOGIN_MUTATION } from '~/jomql/mutation/auth.js'
import { executeJomql } from '~/services/jomql.js'
import sharedService from '~/services/shared.js'
import authService from '~/services/auth.js'

export default {
  components: {},

  data() {
    return {
      inputs: {
        email: '',
        password: '',
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
        const data = await executeJomql(
          'loginUser',
          LOGIN_MUTATION,
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
