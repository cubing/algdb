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
          <v-icon left>{{ recordInfo.icon || 'mdi-domain' }}</v-icon>
          <v-toolbar-title>{{
            title || `${recordInfo.name}s`
          }}</v-toolbar-title>
          <v-divider
            v-if="recordInfo.addOptions"
            class="mx-4"
            inset
            vertical
          ></v-divider>
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
          <v-divider
            v-if="recordInfo.filters.length > 0"
            class="mx-4"
            inset
            vertical
          ></v-divider>

          <v-btn
            v-if="recordInfo.filters.length > 0"
            icon
            @click="showFilterInterface = !showFilterInterface"
          >
            <v-badge
              :value="visibleFiltersCount"
              :content="visibleFiltersCount"
              color="secondary"
            >
              <v-icon>mdi-filter-menu</v-icon>
            </v-badge>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn icon :loading="loading.exportData" @click="exportData()">
            <v-icon>mdi-download</v-icon>
          </v-btn>
          <v-btn icon @click="syncFilters() || reset()">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container v-if="showFilterInterface" class="pb-0">
          <v-row>
            <v-col v-if="recordInfo.hasSearch" :key="-1" cols="3" class="py-0">
              <v-text-field
                v-model="searchInput"
                label="Search"
                placeholder="Type to search"
                outlined
                prepend-icon="mdi-magnify"
                clearable
                @change="filterChanged = true"
              ></v-text-field>
            </v-col>
            <v-col
              v-for="(item, i) in visibleFiltersArray"
              :key="i"
              cols="3"
              class="py-0"
            >
              <v-text-field
                v-if="!item.fieldInfo.optionsInfo"
                v-model="item.value"
                :label="item.fieldInfo.text"
                :prepend-icon="item.fieldInfo.icon"
                filled
                clearable
                @change="filterChanged = true"
              ></v-text-field>
              <v-autocomplete
                v-else-if="
                  item.fieldInfo.optionsInfo.inputType === 'autocomplete' ||
                  item.fieldInfo.optionsInfo.inputType === 'combobox'
                "
                v-model="item.value"
                :items="item.options"
                item-text="name"
                item-value="id"
                :label="item.fieldInfo.text"
                :prepend-icon="item.fieldInfo.icon"
                clearable
                filled
                class="py-0"
                @change="filterChanged = true"
              ></v-autocomplete>
              <v-autocomplete
                v-else-if="
                  item.fieldInfo.optionsInfo.inputType === 'server-autocomplete'
                "
                v-model="item.value"
                :loading="item.loading"
                :search-input.sync="item.search"
                :items="item.options"
                item-text="name"
                item-value="id"
                :label="item.fieldInfo.text"
                :prepend-icon="item.fieldInfo.icon"
                clearable
                filled
                hide-no-data
                cache-items
                class="py-0"
                @update:search-input="handleSearchUpdate(item)"
                @blur="item.focused = false"
                @focus="item.focused = true"
                @change="filterChanged = true"
              ></v-autocomplete>
              <v-select
                v-else-if="item.fieldInfo.optionsInfo.inputType === 'select'"
                v-model="item.value"
                :items="item.options"
                filled
                :label="item.fieldInfo.text"
                :prepend-icon="item.fieldInfo.icon"
                clearable
                item-text="name"
                item-value="id"
                class="py-0"
                @change="filterChanged = true"
              ></v-select>
            </v-col>
          </v-row>
          <v-toolbar v-if="filterChanged" dense flat color="transparent">
            <v-spacer></v-spacer>
            <v-btn color="primary" class="mb-2" @click="updateFilters()">
              <v-icon left>mdi-filter</v-icon>
              Update Filters
            </v-btn>
          </v-toolbar>
        </v-container>
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
              small
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
                <v-btn icon small v-bind="attrs" v-on="on">
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
                    item.name || item.recordInfo.name
                  }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-btn
              v-else
              icon
              small
              @click.stop="toggleItemExpanded(props, null)"
            >
              <v-icon>mdi-chevron-up</v-icon>
            </v-btn>
          </td>
          <td v-for="(headerItem, i) in headers" :key="i">
            <div v-if="headerItem.value === null">
              <v-icon
                v-if="recordInfo.shareOptions"
                small
                @click.stop="openDialog('shareRecord', props.item)"
                >mdi-share-variant</v-icon
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
    <component
      :is="currentShareRecordComponent"
      :status="dialogs.shareRecord"
      :record-info="recordInfo"
      :selected-item="dialogs.selectedItem"
      @close="dialogs.shareRecord = false"
    ></component>
  </div>
</template>

<script>
import crudMixin from '~/mixins/crud'

export default {
  name: 'CrudRecordInterface',

  mixins: [crudMixin],
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
