<template>
  <v-container fluid>
    <v-layout column justify-left align-left>
      <v-flex xs12 sm8 md6>
        <div class="pt-2">
          <CrudRecordInterface
            :record-info="recordInfo"
            :filters="$route.query"
            dense
            @filters-updated="handleFiltersUpdated"
          ></CrudRecordInterface>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import crudPageMixin from '~/mixins/crudPage.js'
import CrudRecordInterface from '~/components/interface/crud/crudAlgcaseInterface.vue'
import { algcaseRecordInfo } from '~/services/type'

export default {
  components: {
    CrudRecordInterface,
  },

  mixins: [crudPageMixin],

  data() {
    return {
      recordInfo: algcaseRecordInfo,
    }
  },
}
</script>

<style scoped></style>
