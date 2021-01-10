<template>
  <div>
    <v-data-table
      :headers="recordInfo.headers"
      :items="records"
      class="elevation-1"
      :loading="loading.loadData"
      :options.sync="options"
      loading-text="Loading... Please wait"
      :server-items-length="recordsTotal"
      :footer-props="footerOptions"
      :expanded.sync="expandedItems"
      show-expand
      single-expand
      :dense="dense"
      @update:options="handleUpdateOptions"
      @item-expanded="handleItemExpanded"
      @click:row="handleRowClick"
    >
      <template v-slot:top>
        <v-toolbar flat color="accent">
          <v-icon v-if="isChildComponent" left
            >mdi-subdirectory-arrow-right</v-icon
          >
          <v-btn v-if="parentPath.length > 0" icon @click="goToParent()">
            <v-icon>mdi-arrow-left</v-icon></v-btn
          >
          <v-icon left>mdi-domain</v-icon>
          <v-toolbar-title
            >{{ capitalizedType }}s
            <span v-for="(item, i) in validFilterParams" :key="i"
              >[{{ i }}: {{ item }}]</span
            ></v-toolbar-title
          >
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-btn
            color="primary"
            dark
            class="mb-2"
            @click="openAddRecordDialog()"
          >
            <v-icon left>mdi-plus</v-icon>
            New {{ capitalizedType }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn icon @click="reset()">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container class="pb-0">
          <v-row>
            <v-col
              v-for="(item, i) in visibleFilters"
              :key="i"
              cols="3"
              class="py-0"
            >
              <v-select
                v-if="item.getOptions"
                v-model="filterInputs[i]"
                :items="filterOptions[i]"
                filled
                :label="item.label"
                style="width: 300px"
                :prepend-icon="item.icon"
                clearable
                @change="filterChanged = true"
              ></v-select>
              <v-text-field
                v-else
                v-model="filterInputs[i]"
                :label="item.label"
                placeholder="Type to search"
                outlined
                :prepend-icon="item.icon"
                clearable
                @change="filterChanged = true"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <v-toolbar v-if="filterChanged" dense flat color="transparent">
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mb-2" @click="updateFilters()">
            <v-icon left>mdi-plus</v-icon>
            Update Filters
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.created_at="props">
        {{ generateTimeStringFromUnix(props.item.created_at) }}
      </template>
      <template v-slot:item.updated_at="props">
        {{ generateTimeStringFromUnix(props.item.updated_at) }}
      </template>
      <template v-slot:item.null="props">
        <v-icon small @click.stop="goToChild(props.item.id)"
          >mdi-arrow-right-circle</v-icon
        >
        <v-icon small @click.stop="openDialog('viewRecord', props.item)"
          >mdi-eye</v-icon
        >
        <v-icon small @click.stop="openDialog('editRecord', props.item)"
          >mdi-pencil</v-icon
        >
        <v-icon small @click.stop="openDialog('deleteRecord', props.item)"
          >mdi-delete</v-icon
        >
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="pr-0">
          <CrudAlgcaseInterface
            class="py-2"
            :record-info="subRecordInfo"
            :filters="subFilter"
            :hidden-filters="hiddenSubFilters"
            is-child-component
            :dense="dense"
            @filters-updated="handleFiltersUpdated"
          ></CrudAlgcaseInterface>
        </td>
      </template>
      <template v-slot:no-data>No records</template>
    </v-data-table>
    <EditRecordDialog
      :status="dialogs.addRecord"
      :record-info="recordInfo"
      :selected-item="dialogs.selectedItem"
      add-mode
      @close="dialogs.addRecord = false"
      @submit="handleListChange()"
    ></EditRecordDialog>
    <EditRecordDialog
      :status="dialogs.editRecord"
      :record-info="recordInfo"
      :selected-item="dialogs.selectedItem"
      @close="dialogs.editRecord = false"
      @submit="handleListChange()"
    ></EditRecordDialog>
    <DeleteRecordDialog
      :status="dialogs.deleteRecord"
      :record-info="recordInfo"
      :selected-item="dialogs.selectedItem"
      @close="dialogs.deleteRecord = false"
      @submit="handleListChange()"
    ></DeleteRecordDialog>
    <EditRecordDialog
      :status="dialogs.viewRecord"
      :record-info="recordInfo"
      :selected-item="dialogs.selectedItem"
      view-mode
      @close="dialogs.viewRecord = false"
    ></EditRecordDialog>
  </div>
</template>

<script>
import crudExpandableMixin from '~/mixins/crudExpandable.js'
import { algcaseRecordInfo } from '~/services/type'
import CrudAlgcaseInterface from '~/components/interface/crud/crudAlgcaseInterface.vue'

export default {
  components: {
    CrudAlgcaseInterface,
  },

  mixins: [crudExpandableMixin],

  data() {
    return {
      subRecordInfo: algcaseRecordInfo,
      parentPath: [],
    }
  },

  computed: {},

  methods: {
    handleRowClick(item) {
      this.goToChild(item.id)
    },

    goToChild(id) {
      this.parentPath.push(this.filterInputs.parent)
      this.filterInputs.parent = id
      this.updateFilters()
    },

    goToParent() {
      this.filterInputs.parent = this.parentPath.pop()
      this.updateFilters()
    },
  },
}
</script>

<style scoped>
.pointer-cursor {
  cursor: pointer;
}

.selected-bg {
  background-color: green;
}
</style>