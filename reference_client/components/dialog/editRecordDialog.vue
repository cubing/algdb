<template>
  <v-dialog
    v-model="status"
    scrollable
    max-width="800px"
    :persistent="mode !== 'view'"
  >
    <v-card>
      <v-toolbar flat>
        <v-icon left>{{ icon }}</v-icon>
        <v-toolbar-title>
          <span class="headline">{{ title }}</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text style="max-height: 600px" class="pt-3">
        <v-container
          v-if="loading.loadRecord || loading.loadDropdowns"
          class="text-center"
          style="height: 250px"
          fill-height
          justify-center
        >
          <v-progress-circular indeterminate></v-progress-circular>
        </v-container>
        <v-container v-else>
          <v-row>
            <v-col
              v-for="(item, i) in inputsArray"
              :key="i"
              cols="12"
              xs="12"
              class="py-0"
            >
              <v-text-field
                v-if="!item.fieldInfo.optionsInfo"
                v-model="item.value"
                :label="item.fieldInfo.text || item.field"
                :readonly="item.readonly || mode === 'view'"
                filled
                dense
                class="py-0"
              ></v-text-field>
              <v-combobox
                v-else-if="item.fieldInfo.optionsInfo.inputType === 'combobox'"
                ref="combobox"
                v-model="item.value"
                :items="item.options"
                item-text="name"
                item-value="id"
                :label="item.fieldInfo.text || item.field"
                :readonly="item.readonly || mode === 'view'"
                :clearable="!item.readonly && mode !== 'view'"
                filled
                class="py-0"
              ></v-combobox>
              <v-autocomplete
                v-else-if="
                  item.fieldInfo.optionsInfo.inputType === 'autocomplete'
                "
                v-model="item.value"
                :items="item.options"
                item-text="name"
                item-value="id"
                :label="item.fieldInfo.text || item.field"
                :readonly="item.readonly || mode === 'view'"
                :clearable="!item.readonly && mode !== 'view'"
                filled
                class="py-0"
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
                :label="item.fieldInfo.text || item.field"
                :readonly="item.readonly || mode === 'view'"
                :clearable="!item.readonly && mode !== 'view'"
                filled
                hide-no-data
                cache-items
                class="py-0"
                @update:search-input="handleSearchUpdate(item)"
                @blur="item.focused = false"
                @focus="item.focused = true"
              ></v-autocomplete>
              <v-select
                v-else-if="item.fieldInfo.optionsInfo.inputType === 'select'"
                v-model="item.value"
                :items="item.options"
                filled
                :label="item.fieldInfo.text || item.field"
                :readonly="item.readonly || mode === 'view'"
                :clearable="!item.readonly && mode !== 'view'"
                item-text="name"
                item-value="id"
                class="py-0"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn
          v-if="mode !== 'view'"
          ref="submit"
          color="primary"
          :loading="loading.editRecord"
          @click="handleSubmit()"
          >Submit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import editRecordDialogMixin from '~/mixins/editRecordDialog'

export default {
  mixins: [editRecordDialogMixin],
}
</script>
