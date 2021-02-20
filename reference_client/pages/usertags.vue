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
            :locked-filters="lockedFilters"
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
import usertagRecordInfo from '~/services/models/usertag'

export default {
  mixins: [crudPageMixin],

  data() {
    return {
      recordInfo: usertagRecordInfo,
    }
  },
  computed: {
    // override
    lockedFilters() {
      return this.$store.getters['auth/user']
        ? [
            {
              field: 'created_by.id',
              operator: 'eq',
              value: this.$store.getters['auth/user']?.id,
            },
          ]
        : []
    },
  },
}
</script>
