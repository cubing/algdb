<template>
  <v-dialog
    v-model="status"
    scrollable
    max-width="800px"
    :persistent="!viewMode"
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

      <v-card-text style="max-height: 600px">
        <v-container
          v-if="loading.loadRecord"
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
              v-for="(item, i) in validInputs"
              :key="i"
              cols="12"
              xs="12"
              class="py-0"
            >
              <v-select
                v-if="recordInfo.inputs[i].getOptions"
                v-model="inputs[i]"
                :items="inputOptions[i]"
                filled
                :label="recordInfo.inputs[i].text"
                :readonly="viewMode || recordInfo.inputs[i].readonly"
                :clearable="!viewMode && !recordInfo.inputs[i].readonly"
                class="py-0"
              ></v-select>
              <v-text-field
                v-else
                v-model="inputs[i]"
                :label="recordInfo.inputs[i].text"
                :readonly="viewMode || recordInfo.inputs[i].readonly"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn
          v-if="!viewMode"
          color="primary"
          :loading="loading.editRecord"
          @click="submit()"
          >Submit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import editRecordDialogMixin from '~/mixins/editRecordDialog.js'

export default {
  mixins: [editRecordDialogMixin],
}
</script>
