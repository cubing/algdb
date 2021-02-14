<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center">
        <img src="../static/algdb1-withcube.png" alt="" style="width: 40%" />
      </div>
      <v-card>
        <v-card-title class="headline">
          Welcome to Algdb Reference Client
        </v-card-title>
        <v-card-text>
          <p>This is a reference client</p>
        </v-card-text>
      </v-card>

      <v-card class="mt-3">
        <v-card-title class="headline"> Release History </v-card-title>
        <v-card-text>
          <div class="release">
            <span class="headline">Coming Soon...</span>
            <ul>
              <li>Release note 1</li>
              <li>Release note 2</li>
              <li>Release note 3</li>
            </ul>
          </div>

          <div class="release">
            <span class="headline">v1.1.3 (26 July 2020)</span>
            <ul>
              <li>Release note 1</li>
              <li>Release note 1</li>
            </ul>
          </div>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  components: {},

  methods: {},
  head() {
    return {
      title: 'Home',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Algdb Reference Client',
        },
      ],
    }
  },
}
</script>

<style scoped>
.release {
  margin-bottom: 16px;
}
</style>
