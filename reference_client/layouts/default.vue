<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <nuxt-link to="/">
        <v-img :src="require('../static/algdb1.png')" class="ma-2" />
      </nuxt-link>
      <v-divider></v-divider>
      <v-list dense>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list dense>
        <v-list-group
          v-for="item in featureItems"
          :key="item.title"
          v-model="item.active"
          :prepend-icon="item.action"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>
          <template v-for="child in item.items">
            <v-list-item
              v-if="canSee(child.roles)"
              :key="child.title"
              :to="child.to"
            >
              <v-list-item-content>
                <v-list-item-title v-text="child.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-group>
      </v-list>
      <template v-slot:append>
        <client-only>
          <template v-if="user">
            <v-menu
              :close-on-content-click="true"
              :max-width="300"
              offset-x
              top
            >
              <template v-slot:activator="{ on }">
                <v-list-item key="-2" v-on="on">
                  <v-list-item-action>
                    <v-img
                      v-if="user.avatar"
                      :src="user.avatar"
                      height="24"
                      width="24"
                      contain
                    />
                    <v-icon v-else>mdi-account</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{{ user.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      user.email
                    }}</v-list-item-subtitle>
                    <v-list-item-subtitle
                      >Role: {{ user.role.name }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
              </template>

              <v-card>
                <v-list>
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-img v-if="user.avatar" :src="user.avatar" />
                      <v-icon v-else>mdi-account</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ user.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{
                        user.email
                      }}</v-list-item-subtitle>
                      <v-list-item-subtitle
                        >Role: {{ user.role.name }}</v-list-item-subtitle
                      >
                    </v-list-item-content>
                  </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list dense>
                  <v-list-item
                    v-for="(item, i) in accountItems"
                    :key="i"
                    :to="item.to"
                    exact
                    nuxt
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item @click="logout()">
                    <v-list-item-content>
                      <v-list-item-title>Logout</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </template>

          <div v-else>
            <v-list-item to="/login" router exact>
              <v-list-item-action>
                <v-icon>mdi-login</v-icon>
              </v-list-item-action>
              <v-list-item-content>Login</v-list-item-content>
            </v-list-item>
          </div>
        </client-only>
      </template>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <a @click="copyIdTokenToClipboard()">{{ getBuildInfo() }}</a>
      <span>&nbsp;&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    <Snackbar />
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import Snackbar from '~/components/snackbar/snackbar'
import authService from '~/services/auth.js'
import sharedService from '~/services/shared.js'

export default {
  components: {
    Snackbar,
  },
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: true,
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/',
        },
      ],
      featureItems: [
        {
          action: 'mdi-silverware-fork-knife',
          active: true,
          items: [
            { title: 'Puzzles', to: 'puzzles', roles: [undefined, 1, 2, 3] },
            { title: 'Algsets', to: 'algsets', roles: [undefined, 1, 2, 3] },
            { title: 'Algcases', to: 'algcases', roles: [undefined, 1, 2, 3] },
            { title: 'Algs', to: 'algs', roles: [undefined, 1, 2, 3] },
          ],
          title: 'Features',
        },
      ],
      accountItems: [{ title: 'Settings', to: '/settings', exact: false }],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Algdb Reference Frontend',
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
    }),
  },

  methods: {
    canSee(allowedRoles) {
      return allowedRoles.includes(this.$store.getters['auth/user']?.role?.id)
    },
    copyIdTokenToClipboard() {
      if (this.$store.getters['auth/token']) {
        sharedService.copyToClipboard(this, this.$store.getters['auth/token'])
      }
    },

    logout() {
      try {
        this.$router.push('/')

        authService.handleLogout(this)
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
    },

    getBuildInfo() {
      return (
        'Build ' +
        (process.env.VER ? process.env.VER + ' - ' : '') +
        process.env.build_date
      )
    },
  },
}
</script>
