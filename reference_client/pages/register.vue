<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Register</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn text nuxt to="/login">Login</v-btn>
        </v-toolbar>
        <RegisterInterface
          @login-success="handleLoginSuccess"
        ></RegisterInterface>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import RegisterInterface from '~/components/interface/auth/registerInterface.vue'

export default {
  middleware: 'router-auth',

  components: {
    RegisterInterface,
  },

  data() {
    return {}
  },

  methods: {
    handleLoginSuccess() {
      this.$router.push('/')
    },
  },

  head() {
    return {
      title: 'Register',
    }
  },
}
</script>
