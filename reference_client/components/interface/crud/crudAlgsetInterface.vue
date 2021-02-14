<template>
  <div :class="{ 'expanded-table-bg': isChildComponent }">
    <v-data-table
      :headers="recordInfo.headers"
      :items="records"
      class="elevation-1"
      :loading="loading.loadData"
      :options.sync="options"
      loading-text="Loading... Please wait"
      :server-items-length="nextPaginatorInfo.total"
      :footer-props="footerOptions"
      :dense="dense"
      :expanded.sync="expandedItems"
      :show-expand="hasNested"
      :single-expand="hasNested"
      @update:sort-by="handlePageReset"
      @update:sort-desc="handlePageReset"
      @update:page="handleUpdatePage"
      @update:options="handleUpdateOptions"
    >
      <template v-slot:top>
        <v-toolbar flat color="accent">
          <v-btn v-if="parentPath.length > 0" icon @click="goToParent()">
            <v-icon>mdi-arrow-left</v-icon></v-btn
          >
          <v-icon left>mdi-domain</v-icon>
          <v-toolbar-title
            >{{ capitalizedType }}s
            <span v-for="(item, i) in visibleRawFiltersArray" :key="i"
              >[{{ item.field }}-{{ item.operator }}-{{ item.value }}]</span
            >
            <span v-if="parentPath.length"
              >[{{ parentPath.map((ele) => ele.name).join(' / ') }}]</span
            >
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-btn
            v-if="recordInfo.addRecordComponent !== null"
            color="primary"
            darks
            class="mb-2"
            @click="openAddRecordDialog()"
          >
            <v-icon left>mdi-plus</v-icon>
            New {{ capitalizedType }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn icon :loading="loading.exportData" @click="exportData()">
            <v-icon>mdi-download</v-icon>
          </v-btn>
          <v-btn icon @click="reset()">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container class="pb-0">
          <v-row>
            <v-col v-if="recordInfo.hasSearch" :key="-1" cols="3" class="py-0">
              <v-text-field
                v-model="searchInput"
                label="Search"
                placeholder="Type to search"
                outlined
                prepend-icon="mdi-magnify"
                @change="filterChanged = true"
              ></v-text-field>
            </v-col>
            <v-col
              v-for="(item, i) in visibleFiltersArray"
              :key="i"
              cols="3"
              class="py-0"
            >
              <v-select
                v-if="item.fieldInfo.getOptions"
                v-model="item.value"
                :items="item.options"
                filled
                :label="item.fieldInfo.label"
                :prepend-icon="item.fieldInfo.icon"
                clearable
                item-text="name"
                item-value="id"
                @change="filterChanged = true"
              ></v-select>
              <v-text-field
                v-else
                v-model="item.value"
                :label="item.fieldInfo.label"
                placeholder="Type to search"
                outlined
                :prepend-icon="item.fieldInfo.icon"
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
      <template v-slot:item="props">
        <tr
          :class="{ 'expanded-row-bg': props.isExpanded }"
          :key="props.item.id"
          @click="handleRowClick(props.item)"
        >
          <td v-if="hasNested">
            <v-btn icon @click.stop="props.expand(!props.isExpanded)">
              <v-icon
                >mdi-chevron-{{ props.isExpanded ? 'up' : 'down' }}</v-icon
              >
            </v-btn>
          </td>
          <td v-for="(headerItem, i) in recordInfo.headers" :key="i">
            <div v-if="headerItem.value === null">
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
            </div>
            <span v-else>
              {{ renderTableRowData(headerItem, props.item) }}
              <v-icon
                v-if="headerItem.copyable"
                small
                @click.stop="
                  copyToClipboard(getTableRowData(headerItem, props.item))
                "
                >mdi-content-copy</v-icon
              >
            </span>
          </td>
        </tr>
      </template>
      <template v-if="hasNested" v-slot:expanded-item="{ headers }">
        <td :colspan="headers.length" class="pr-0">
          <component
            :is="childInterfaceComponent"
            class="mb-2"
            :record-info="recordInfo.nested"
            :locked-filters="lockedSubFilters"
            :add-filters="addSubFilters"
            :filters="additionalSubFilters"
            :hidden-filters="hiddenSubFilters"
            :search="subSearchInput"
            is-child-component
            :dense="dense"
            @filters-updated="handleSubFiltersUpdated"
          ></component>
        </td>
      </template>
      <template v-slot:no-data>No records</template>
    </v-data-table>
    <component
      :is="currentAddRecordComponent"
      :status="dialogs.addRecord"
      :record-info="recordInfo"
      :selected-item="dialogs.selectedItem"
      add-mode
      @close="dialogs.addRecord = false"
      @submit="handleListChange()"
    ></component>
    <component
      :is="currentEditRecordComponent"
      :status="dialogs.editRecord"
      :record-info="recordInfo"
      :selected-item="dialogs.selectedItem"
      @close="dialogs.editRecord = false"
      @submit="handleListChange()"
    ></component>
    <component
      :is="currentDeleteRecordComponent"
      :status="dialogs.deleteRecord"
      :record-info="recordInfo"
      :selected-item="dialogs.selectedItem"
      @close="dialogs.deleteRecord = false"
      @submit="handleListChange()"
    ></component>
    <component
      :is="currentViewRecordComponent"
      :status="dialogs.viewRecord"
      :record-info="recordInfo"
      :selected-item="dialogs.selectedItem"
      view-mode
      @close="dialogs.viewRecord = false"
    ></component>
  </div>
</template>

<script>
import crudMixin from '~/mixins/crud'
import { executeJomql } from '~/services/jomql'

export default {
  mixins: [crudMixin],

  data() {
    return {
      parentPath: [],
    }
  },
  computed: {
    additionalLockedFilters() {
      return {
        field: 'parent',
        operator: 'eq',
        value: this.parentPath.length
          ? this.parentPath[this.parentPath.length - 1].id
          : null,
      }
    },
  },

  methods: {
    // override
    handleRowClick(item) {
      this.goToChild(item)
    },

    goToChild(item) {
      this.parentPath.push(item)
      // clear the searchInput
      this.searchInput = ''
      this.reset()
    },

    goToParent() {
      this.parentPath.pop()
      this.searchInput = ''
      this.reset()
    },

    // override
    openAddRecordDialog() {
      const initializedRecord = {}

      this.addFilters
        .concat(this.additionalLockedFilters)
        .forEach((addFilter) => {
          initializedRecord[addFilter.field] = addFilter.value
        })

      this.openDialog('addRecord', initializedRecord)
    },

    // override
    async getRecords(paginated = true) {
      const paginationArgs = paginated
        ? {
            [this.positivePageDelta ? 'first' : 'last']: this.options
              .itemsPerPage,
            ...(this.options.page > 1 &&
              this.positivePageDelta && {
                after: this.currentPaginatorInfo.endCursor,
              }),
            ...(!this.positivePageDelta && {
              before: this.currentPaginatorInfo.startCursor,
            }),
          }
        : {
            first: 100, // first 100 rows only
          }
      const data = await executeJomql(this, {
        ['get' + this.capitalizedType + 'Paginator']: {
          paginatorInfo: {
            total: true,
            startCursor: true,
            endCursor: true,
          },
          edges: {
            node: this.recordInfo.headers.reduce(
              (total, val) => {
                // if null, skip
                if (!val.value) return total

                // if nested, process (only supporting one level of nesting)
                if (val.value.includes('.')) {
                  const parts = val.value.split(/\./)

                  if (!total[parts[0]]) {
                    total[parts[0]] = {}
                  }

                  total[parts[0]][parts[1]] = true
                } else {
                  total[val.value] = true
                }
                return total
              },
              { id: true }
            ),
            cursor: true,
          },
          __args: {
            ...paginationArgs,
            sortBy: this.options.sortBy,
            sortDesc: this.options.sortDesc,
            filterBy: this.filters
              .concat(this.lockedFilters)
              .concat(this.additionalLockedFilters)
              .reduce((total, ele) => {
                if (!total[ele.field]) total[ele.field] = []
                total[ele.field].push({
                  operator: ele.operator,
                  value: ele.value, // assuming this value has been parsed already
                })
                return total
              }, {}),
            ...(this.search && { search: this.search }),
            ...(this.groupBy && { groupBy: this.groupBy }),
          },
        },
      })

      return data
    },
  },
}
</script>

<style scoped>
.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr.expanded-row-bg:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: var(--v-secondary-base);
}
</style>
