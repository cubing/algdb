<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <div v-if="errorMessage">
        <span class="display-1 pl-2">{{ errorMessage }} </span>
      </div>
      <div v-else-if="loading.verifying">
        <span class="display-1 pl-2"
          >Verifying WCA Code...
          <v-progress-circular indeterminate></v-progress-circular>
        </span>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import sharedService from '~/services/shared'
import authService from '~/services/auth'
import { executeJomql } from '~/services/jomql'

export default {
  components: {},

  data() {
    return {
      loading: {
        verifying: false,
      },

      errorMessage: null,
    }
  },

  mounted() {
    this.attemptWcaAuthorization()
  },

  methods: {
    async attemptWcaAuthorization() {
      this.loading.verifying = true
      try {
        if (!this.$route.query.code) {
          throw sharedService.generateError(
            'Missing authorization code, please try again.'
          )
        }

        const data = await executeJomql(this, {
          socialLogin: {
            token: true,
            type: true,
            user: {
              id: true,
              email: true,
              name: true,
              role: true,
              permissions: true,
              all_permissions: true,
            },
            __args: {
              provider: 'wca',
              code: this.$route.query.code,
              redirect_uri: window.location.href,
            },
          },
        })

        await authService.handleLogin(this, data)

        this.$router.push('/')
      } catch (err) {
        sharedService.handleError(err, this.$root)
        this.errorMessage = sharedService.sanitizeErrorMessage(err.message)
      }
      this.loading.verifying = false
    },
  },

  head() {
    return {
      title: 'Verify WCA Authorization',
    }
  },
}
</script>
