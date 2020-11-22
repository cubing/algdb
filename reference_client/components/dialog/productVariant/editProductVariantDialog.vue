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
            <v-col cols="6" class="py-0">
              <v-text-field
                v-model="inputs.product"
                :label="recordInfo.inputs.product.text"
                :readonly="viewMode || recordInfo.inputs.product.readonly"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4" class="py-0">
              <v-select
                v-model="otherInputs.propoption"
                :items="propOptionsArray"
                :readonly="viewMode"
                filled
                label="PropOption"
                item-text="name"
                item-value="id"
                style="width: 300px"
              ></v-select>
            </v-col>
            <v-col cols="4" class="py-0">
              <v-select
                v-model="inputs.propvalue"
                :items="propValuesArray"
                :readonly="viewMode"
                filled
                label="PropValue"
                item-text="name"
                item-value="id"
                style="width: 300px"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="py-0">
              <v-text-field
                v-model="inputs.image"
                :label="recordInfo.inputs.image.text"
                readonly
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
            <v-col v-if="!viewMode" cols="12" class="py-0">
              <UploadFileInterface
                :files="filesAdded"
                hide-file-on-finish
                label-text="Image (Drag and Drop)"
                @add-file="addFile"
                @upload-completed="handleUploadCompleted"
                @remove-file="removeFile"
              ></UploadFileInterface>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-container fluid grid-list-xs class="px-0 py-0">
                <v-layout row wrap>
                  <v-flex class="xs3">
                    <v-card v-if="inputs.image" flat>
                      <v-system-bar v-if="!viewMode" lights-out>
                        <v-icon @click="">mdi-arrow-all</v-icon>
                        <v-spacer></v-spacer>
                        <v-btn icon @click.native="inputs.image = null">
                          <v-icon color="error">mdi-close</v-icon>
                        </v-btn>
                      </v-system-bar>
                      <v-img
                        :src="inputs.image"
                        aspect-ratio="1"
                        contain
                      ></v-img>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="3" class="py-0">
              <v-text-field
                v-model="inputs.sort"
                :label="recordInfo.inputs.sort.text"
                :readonly="viewMode || recordInfo.inputs.sort.readonly"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="py-0">
              <v-text-field
                v-model="inputs.price"
                :label="recordInfo.inputs.price.text"
                :readonly="viewMode || recordInfo.inputs.price.readonly"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="py-0">
              <v-text-field
                v-model="inputs.weight_grams"
                :label="recordInfo.inputs.weight_grams.text"
                :readonly="viewMode || recordInfo.inputs.weight_grams.readonly"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="py-0">
              <v-text-field
                v-model="inputs.mfr_weight"
                :label="recordInfo.inputs.mfr_weight.text"
                :readonly="viewMode || recordInfo.inputs.mfr_weight.readonly"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="py-0">
              <v-text-field
                v-model="inputs.sku_prefix"
                :label="recordInfo.inputs.sku_prefix.text"
                :readonly="viewMode || recordInfo.inputs.sku_prefix.readonly"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="py-0">
              <v-text-field
                v-model="inputs.carton_qty"
                :label="recordInfo.inputs.carton_qty.text"
                :readonly="viewMode || recordInfo.inputs.carton_qty.readonly"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="py-0">
              <v-text-field
                v-model="inputs.quantity"
                :label="recordInfo.inputs.quantity.text"
                :readonly="viewMode || recordInfo.inputs.quantity.readonly"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="py-0">
              <v-text-field
                v-model="inputs.cost"
                :label="recordInfo.inputs.cost.text"
                :readonly="viewMode || recordInfo.inputs.cost.readonly"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="py-0">
              <v-text-field
                v-model="inputs.min_stock"
                :label="recordInfo.inputs.min_stock.text"
                :readonly="viewMode || recordInfo.inputs.min_stock.readonly"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-select
          v-model="inputs.status"
          :items="productStatusesArray"
          :readonly="viewMode"
          label="Status"
          style="width: 300px"
        ></v-select>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn color="primary" :loading="loading.editRecord" @click="submit()"
          >Submit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import editRecordDialogMixin from '~/mixins/editRecordDialog.js'
import {
  getPropOptions,
  getPropValues,
  getProductStatuses,
} from '~/services/dropdown.js'
import UploadFileInterface from '~/components/interface/file/uploadFileInterface'
import { executeJomql } from '~/services/jomql.js'
import sharedService from '~/services/shared.js'

export default {
  components: {
    UploadFileInterface,
  },

  mixins: [editRecordDialogMixin],

  data() {
    return {
      otherInputs: {
        propoption: null,
      },

      propOptionsArray: [],
      propValuesArray: [],
      productStatusesArray: [],

      filesAdded: [],
    }
  },

  watch: {
    status() {
      this.reset(true)
    },

    'otherInputs.propoption'(val) {
      // deny falsey except 0
      if (val !== 0 && !val) return

      this.loadPropValues(val)
    },
  },

  methods: {
    addFile(file) {
      this.filesAdded.push(file)
    },

    handleUploadCompleted(file) {
      this.inputs.image = file.servingUrl
    },

    removeFile(file) {
      const index = this.filesAdded.indexOf(file)

      if (index !== -1) {
        this.filesAdded.splice(index, 1)
      }
    },

    // override
    async loadRecord() {
      this.loading.loadRecord = true
      try {
        const data = await executeJomql(
          'get' + this.capitalizedType,
          {
            id: true,
            ...Object.keys(this.recordInfo.inputs).reduce((total, item) => {
              total[item] = true
              return total
            }, {}),

            // special
            propvalue: {
              id: true,
              propoption: true,
            },
          },
          {
            id: this.selectedItem.id,
          }
        )

        this.inputs = Object.keys(this.recordInfo.inputs).reduce(
          (total, item) => {
            this.$set(total, item, data[item])
            return total
          },
          {}
        )

        // special
        this.otherInputs.propoption = this.inputs.propvalue.propoption
        this.inputs.propvalue = this.inputs.propvalue.id
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.loadRecord = false
    },

    async loadPropValues(propoption) {
      this.propValuesArray = await getPropValues({ propoption })
    },

    // override
    async reset(hardReset = false) {
      if (!this.status) return

      this.filesAdded = []
      this.otherInputs.propoption = null

      if (this.addMode) {
        this.inputs = {
          ...Object.keys(this.recordInfo.inputs).reduce((total, item) => {
            this.$set(
              total,
              item,
              this.recordInfo.inputs[item].default
                ? this.recordInfo.inputs[item].default()
                : null
            )
            return total
          }, {}),
          ...this.selectedItem,
        }
      } else {
        this.loadRecord()
      }

      if (hardReset) {
        this.propOptionsArray = await getPropOptions()
        this.propValuesArray = []
        this.productStatusesArray = await getProductStatuses()
      }
    },
  },
}
</script>
