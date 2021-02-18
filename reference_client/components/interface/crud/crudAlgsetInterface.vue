<template>
  <div :class="{ 'expanded-table-bg': isChildComponent }">
    <v-data-table
      :headers="headers"
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
          <v-icon left>{{ recordInfo.icon || 'mdi-domain' }}</v-icon>
          <v-toolbar-title
            >{{ title || `${recordInfo.name}s` }}
            <span v-for="(item, i) in visibleRawFiltersArray" :key="i"
              >[{{ item.field }}-{{ item.operator }}-{{ item.value }}]</span
            >
            <span v-if="parentPath.length"
              >[{{ parentPath.map((ele) => ele.name).join(' / ') }}]</span
            >
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-btn
            v-if="recordInfo.addOptions"
            color="primary"
            darks
            class="mb-2"
            @click="openAddRecordDialog()"
          >
            <v-icon left>mdi-plus</v-icon>
            New {{ recordInfo.name }}
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
                :label="item.fieldInfo.text"
                :prepend-icon="item.fieldInfo.icon"
                clearable
                item-text="name"
                item-value="id"
                @change="filterChanged = true"
              ></v-select>
              <v-text-field
                v-else
                v-model="item.value"
                :label="item.fieldInfo.text"
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
          :key="props.item.id"
          :class="{
            'expanded-row-bg': props.isExpanded,
          }"
          @click="handleRowClick(props.item)"
        >
          <td v-if="hasNested">
            <v-btn
              v-if="recordInfo.expandTypes.length === 1"
              icon
              @click.stop="
                toggleItemExpanded(
                  props,
                  props.isExpanded ? null : recordInfo.expandTypes[0]
                )
              "
            >
              <v-icon
                >mdi-chevron-{{ props.isExpanded ? 'up' : 'down' }}</v-icon
              >
            </v-btn>

            <v-menu v-else-if="!props.isExpanded" bottom left offset-x>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>

              <v-list dense>
                <v-list-item
                  v-for="(item, i) in recordInfo.expandTypes"
                  :key="i"
                  dense
                  @click="toggleItemExpanded(props, item)"
                >
                  <v-list-item-icon>
                    <v-icon>{{ item.recordInfo.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{
                    item.recordInfo.name
                  }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-btn v-else icon @click.stop="toggleItemExpanded(props, null)">
              <v-icon>mdi-chevron-up</v-icon>
            </v-btn>
          </td>
          <td v-for="(headerItem, i) in headers" :key="i">
            <div v-if="headerItem.value === null">
              <v-icon small @click.stop="goToChild(props.item.id)"
                >mdi-arrow-right-circle</v-icon
              >
              <v-icon
                v-if="recordInfo.viewOptions"
                small
                @click.stop="openDialog('viewRecord', props.item)"
                >mdi-eye</v-icon
              >
              <v-icon
                v-if="recordInfo.editOptions"
                small
                @click.stop="openDialog('editRecord', props.item)"
                >mdi-pencil</v-icon
              >
              <v-icon
                v-if="recordInfo.deleteOptions"
                small
                @click.stop="openDialog('deleteRecord', props.item)"
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
            :record-info="expandTypeObject.recordInfo"
            :hidden-headers="expandTypeObject.excludeHeaders"
            :locked-filters="lockedSubFilters"
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
      mode="add"
      @close="dialogs.addRecord = false"
      @submit="handleListChange()"
    ></component>
    <component
      :is="currentEditRecordComponent"
      :status="dialogs.editRecord"
      :record-info="recordInfo"
      :selected-item="dialogs.selectedItem"
      mode="edit"
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
      mode="view"
      @close="dialogs.viewRecord = false"
    ></component>
  </div>
</template>

<script>
import crudMixin from '~/mixins/crud'
import { executeJomql } from '~/services/jomql'
import { collapseObject } from '~/services/common'

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
        field: 'parent.id',
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

      this.lockedFilters
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
            node: collapseObject(
              this.recordInfo.headers.reduce(
                (total, headerObject) => {
                  const fieldInfo = this.recordInfo.fields[headerObject.field]

                  // field unknown, abort
                  if (!fieldInfo)
                    throw new Error('Unknown field: ' + headerObject.field)

                  total[headerObject.field] = true
                  return total
                },
                { id: true } // always add id
              )
            ),
          },
          __args: {
            ...paginationArgs,
            sortBy: this.options.sortBy,
            sortDesc: this.options.sortDesc,
            filterBy: [
              this.filters
                .concat(this.lockedFilters)
                .concat(this.additionalLockedFilters)
                .reduce((total, ele) => {
                  if (!total[ele.field]) total[ele.field] = {}
                  // assuming this value has been parsed already
                  total[ele.field][ele.operator] = ele.value
                  return total
                }, {}),
            ],
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
