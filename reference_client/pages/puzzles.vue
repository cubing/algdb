<template>
  <v-container fluid>
    <v-layout column justify-left align-left>
      <v-flex xs12 sm8 md6>
        <div class="pt-2">
          <component
            :is="interfaceComponent"
            :record-info="recordInfo"
            :search="$route.query.search"
            :filters="filters"
            dense
            @filters-updated="handleFiltersUpdated"
          ></component>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import crudPageMixin from '~/mixins/crudPage'
import puzzleRecordInfo from '~/services/models/puzzle'

export default {
  mixins: [crudPageMixin],

  data() {
    return {
      recordInfo: puzzleRecordInfo,
    }
  },
}
</script>
