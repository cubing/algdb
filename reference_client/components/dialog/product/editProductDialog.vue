<template>
  <v-dialog
    v-model="status"
    scrollable
    max-width="800px"
    :persistent="!viewMode"
  >
    <v-card v-if="selectedItem">
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
            <v-col cols="12" xs="12" class="py-0">
              <v-text-field
                v-model="inputs.name"
                :label="recordInfo.inputs.name.text"
                :readonly="viewMode || recordInfo.inputs.name.readonly"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" xs="12" class="pt-0">
              <wysiwyg v-model="inputs.description" />
            </v-col>
            <v-col cols="6" class="py-0">
              <v-text-field
                v-model="inputs.display_width"
                :label="recordInfo.inputs.display_width.text"
                :readonly="viewMode || recordInfo.inputs.display_width.readonly"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="py-0">
              <v-text-field
                v-model="inputs.display_weight"
                :label="recordInfo.inputs.display_weight.text"
                :readonly="
                  viewMode || recordInfo.inputs.display_weight.readonly
                "
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="!viewMode">
            <v-col cols="12" class="py-0">
              <UploadFileInterface
                :files="filesAdded"
                hide-file-on-finish
                label-text="Images (Drag and Drop)"
                @add-file="addFile"
                @upload-completed="handleUploadCompleted"
                @remove-file="removeFile"
              ></UploadFileInterface>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-container fluid grid-list-xs class="px-0 py-0">
                <Draggable
                  v-model="inputs.images"
                  class="layout row wrap"
                  :disabled="viewMode"
                >
                  <v-flex
                    v-for="(item, i) in inputs.images"
                    :key="i"
                    :class="'xs3'"
                  >
                    <v-card flat>
                      <v-system-bar v-if="!viewMode" lights-out>
                        <v-icon @click="">mdi-arrow-all</v-icon>
                        <v-spacer></v-spacer>
                        <v-btn icon @click.native="removeImageByIndex(i)">
                          <v-icon color="error">mdi-close</v-icon>
                        </v-btn>
                      </v-system-bar>
                      <v-img :src="item" aspect-ratio="1" contain></v-img>
                    </v-card>
                  </v-flex>
                </Draggable>
              </v-container>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" class="py-0">
              <v-text-field
                v-model="inputs.vendor"
                :label="recordInfo.inputs.vendor.text"
                :readonly="viewMode || recordInfo.inputs.vendor.readonly"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="py-0">
              <v-select
                v-model="inputs.vendor"
                :items="vendorsArray"
                :readonly="viewMode"
                filled
                label="Existing Vendors"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" class="py-0">
              <v-text-field
                v-model="inputs.product_type"
                :label="recordInfo.inputs.product_type.text"
                :readonly="viewMode || recordInfo.inputs.product_type.readonly"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="py-0">
              <v-select
                v-model="inputs.product_type"
                :items="productTypesArray"
                :readonly="viewMode"
                filled
                label="Existing Product Types"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" class="py-0">
              <v-select
                v-model="otherInputs.supplier"
                :items="suppliersArray"
                :readonly="viewMode"
                filled
                label="Suppliers"
                item-text="name"
                item-value="shopify_id"
              ></v-select>
            </v-col>
            <v-col cols="6" class="py-0">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" v-bind="attrs" v-on="on">
                    Special Tags
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in specialTagsArray"
                    :key="index"
                    @click="appendTag(item.value)"
                  >
                    <v-list-item-title>{{ item.text }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="py-0">
              <v-text-field
                v-model="inputs.tags"
                :label="recordInfo.inputs.tags.text"
                :readonly="viewMode || recordInfo.inputs.tags.readonly"
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
          style="width: 200px"
        ></v-select>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn
          v-if="selectedItem.status === 'READY_FOR_IMPORT'"
          color="warning"
          :loading="loading.exportRecord"
          @click="uploadToShopify()"
          >Export to Shopify</v-btn
        >
        <v-btn color="primary" :loading="loading.editRecord" @click="submit()"
          >Submit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Draggable from 'vuedraggable'
import editRecordDialogMixin from '~/mixins/editRecordDialog.js'
import {
  getVendors,
  getSuppliers,
  getProductTypes,
  getProductStatuses,
} from '~/services/dropdown.js'
import UploadFileInterface from '~/components/interface/file/uploadFileInterface'
import { executeJomql } from '~/services/jomql.js'
import sharedService from '~/services/shared.js'

export default {
  components: {
    UploadFileInterface,
    Draggable,
  },

  mixins: [editRecordDialogMixin],

  data() {
    return {
      // override
      loading: {
        editRecord: false,
        loadRecord: false,
        exportRecord: false,
      },

      otherInputs: {
        supplier: null,
      },

      vendorsArray: [],
      suppliersArray: [],
      productTypesArray: [],
      productStatusesArray: [],

      specialTagsArray: [
        {
          text: 'Magnetic',
          value: 'Magnets_Magnetic',
        },
        {
          text: 'Preorder',
          value: 'Preorder_Preorder',
        },
        {
          text: 'Premium Type - Mystic',
          value: 'Premium_Premium,Premium Type_Mystic',
        },
        {
          text: 'Premium Type - Angstrom',
          value: 'Premium_Premium,Premium Type_Angstrom Research',
        },
        {
          text: 'Premium Type - Pro Shop',
          value: 'Premium_Premium,Premium Type_Cubicle Pro Shop',
        },
        {
          text: 'Premium Type - Celeritas',
          value: 'Premium_Premium,Premium Type_Celeritas',
        },
        {
          text: 'Premium Type - Max',
          value: 'Premium_Premium,Premium Type_MAX',
        },
        {
          text: 'Cubicle Custom',
          value: 'Custom_Cubicle Custom',
        },
        {
          text: 'Weight Estimated',
          value: 'weightestimated',
        },
      ],

      filesAdded: [],
    }
  },

  watch: {
    status() {
      this.reset(true)
    },

    'otherInputs.supplier'(val) {
      this.appendTag(val)
    },
  },

  methods: {
    appendTag(tag) {
      if (!tag) return

      this.inputs.tags = this.inputs.tags ? this.inputs.tags + ',' + tag : tag
    },

    async uploadToShopify() {
      this.loading.exportRecord = true
      try {
        // get product Data
        const productData = await executeJomql(
          'getProduct',
          {
            id: true,
            name: true,
            description: true,
            vendor: true,
            product_type: true,
            tags: true,
            images: true,
            display_width: true,
            display_weight: true,
            variants: {
              data: {
                id: true,
                propvalue: {
                  id: true,
                  name: true,
                  propoption: {
                    id: true,
                    name: true,
                  },
                },
                image: true,
                price: true,
                weight_grams: true,
                sku_prefix: true,
                carton_qty: true,
                min_stock: true,
                mfr_weight: true,
                quantity: true,
                cost: true,
                sort: true,
                shopify_id: true,
              },
              __args: {
                sortBy: ['sort'],
                sortDesc: [false],
                filterBy: {
                  status: 'READY_FOR_IMPORT',
                },
              },
            },
          },
          {
            id: this.selectedItem.id,
          }
        )

        const adjustedTags = productData.tags.split(',')

        // add implicit tags
        adjustedTags.push(
          'Availability_Available',
          'Type_' + productData.product_type,
          'Manufacturer_' + productData.vendor
        )

        // if display_width and display_weight are non-zero, add the relevant tags
        if (productData.display_width) {
          adjustedTags.push(
            'Dimensions_' + productData.display_width.toFixed(1)
          )
        }

        if (productData.display_weight) {
          const rangeMap = {
            0: '0.0-49.9',
            50: '50.0-54.9',
            55: '55.0-59.9',
            60: '60.0-64.9',
            65: '64.0-69.9',
            70: '70.0-74.9',
            75: '75.0-79.9',
            80: '80.0-84.9',
            85: '85.0-89.9',
            90: '90.0-94.9',
            95: '95.0-99.9',
            100: '100.0-249.9',
            250: '250.0-499.9',
            500: '500.0-749.9',
            750: '750.0-999.9',
            1000: '1000+',
          }
          let rangeTag
          for (const key in rangeMap) {
            if (productData.display_weight >= key) {
              rangeTag = rangeMap[key]
            }
          }

          adjustedTags.push('Weight_' + productData.display_weight.toFixed(1))
          adjustedTags.push('Weight Range_' + rangeTag)
        }

        // add variant tags only for Color
        productData.variants.data.forEach((variant) => {
          if (variant.propvalue.propoption.id === 1) {
            adjustedTags.push(
              variant.propvalue.propoption.name + '_' + variant.propvalue.name
            )
          }
        })

        const data = await executeJomql(
          'executeShopifyGraphqlQuery',
          {},
          {
            query: `
              mutation {
                productCreate(input: {
                  title: "${productData.name}",
                  bodyHtml: "${productData.description}",
                  vendor: "${productData.vendor}",
                  productType: "${productData.product_type}",
                  tags: ${JSON.stringify(adjustedTags)},
                  published: true,
                  images:  ${JSON.stringify(
                    productData.images.map((ele) => ({
                      altText: productData.name,
                      src: ele,
                    }))
                  ).replace(/(?<!\\)"([^"]+)(?<!\\)":/g, '$1:')},
                  options: ["${
                    productData.variants.data[0].propvalue.propoption.name
                  }"],
                  variants: ${JSON.stringify(
                    productData.variants.data.map((variant) => ({
                      options: [variant.propvalue.name],
                      price: variant.price,
                      sku:
                        (variant.sku_prefix || '') +
                        productData.id +
                        '_' +
                        variant.propvalue.propoption.id +
                        '_' +
                        variant.propvalue.id,
                      weight: variant.weight_grams,
                      weightUnit: '_GRAMS_',
                      inventoryItem: {
                        cost: variant.cost,
                      },
                      requiresShipping: true,
                      inventoryQuantities: [
                        {
                          availableQuantity: variant.quantity,
                          locationId: 'gid://shopify/Location/16017522761',
                        },
                        {
                          availableQuantity: 0,
                          locationId: 'gid://shopify/Location/20804075593',
                        },
                      ],
                      inventoryPolicy: '_DENY_',
                      inventoryManagement: '_SHOPIFY_',
                      metafields: [
                        {
                          key: 'inventory',
                          value: JSON.stringify({
                            restockable: String(
                              variant.is_restockable ? '1' : '0'
                            ),
                            cartonQty: String(variant.carton_qty),
                            minStock: String(variant.min_stock),
                            mfrWeight: String(variant.mfr_weight),
                            location: '',
                            msrp: String(variant.price),
                          }),
                          valueType: '_JSON_STRING_',
                          namespace: 'ops',
                        },
                      ],
                    }))
                  )
                    .replace(/(?<!\\)"([^"]+)(?<!\\)":/g, '$1:')
                    .replace(/"_([^"]+)_"/g, '$1')}
                }) {
                  product {
                    id
                    variants(first: 100) {
                      edges {
                        node {
                          id
                          inventoryItem {
                            id
                          }
                        }
                      }
                    }
                  }
                }
              }
          `,
          }
        )

        const product = data.productCreate.product

        // loop through variants and perform cleanup
        for (let i = 0; i < product.variants.edges.length; i++) {
          const variant = product.variants.edges[i]
          // update the inventory item
          await this.updateShopifyInventoryItems(variant.node.inventoryItem.id)

          // add the image for each variant, then associate it with the variant
          if (productData.variants.data[i].image) {
            await this.updateVariantImage(
              product.id,
              variant.node.id,
              productData.variants.data[i].image,
              productData.name +
                (productData.variants.data[i].propvalue.name === 'Default Title'
                  ? ''
                  : ' - ' + productData.variants.data[i].propvalue.name)
            )
          }

          // update the variant status
          await executeJomql(
            'updateProductVariant',
            {
              id: true,
            },
            {
              id: productData.variants.data[i].id,
              status: 'DONE',
              shopify_id: variant.node.id,
            }
          )
        }

        this.$notifier.showSnackbar({
          message: 'Exported ' + productData.variants.data.length + ' Variants',
          variant: 'success',
        })

        this.$emit('submit', data)

        this.close()
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.exportRecord = false
    },

    async updateShopifyInventoryItems(inventoryItemGid) {
      const data = await executeJomql(
        'executeShopifyGraphqlQuery',
        {},
        {
          query: `
            mutation {
              inventoryItemUpdate(id: "${inventoryItemGid}", input: {
                harmonizedSystemCode: "950300",
                countryCodeOfOrigin: US
              }) {
                inventoryItem {
                  id
                }
              }
            }
        `,
        }
      )

      return data.inventoryItemUpdate.inventoryItem
    },

    async updateVariantImage(productGid, variantGid, imageUrl, altText) {
      const productId = productGid.split('/').pop()
      const variantId = variantGid.split('/').pop()

      const data = await executeJomql(
        'executeShopifyRestQuery',
        {},
        {
          method: 'post',
          path: '/products/' + productId + '/images.json',
          params: {
            image: {
              variant_ids: [variantId],
              src: imageUrl,
              alt: altText,
            },
          },
        }
      )

      return data
    },

    addFile(file) {
      this.filesAdded.push(file)
    },

    handleUploadCompleted(file) {
      this.inputs.images.push(file.servingUrl)
    },

    removeFile(file) {
      const index = this.filesAdded.indexOf(file)

      if (index !== -1) {
        this.filesAdded.splice(index, 1)
      }
    },

    removeImageByIndex(index) {
      this.inputs.images.splice(index, 1)
    },

    // override
    async reset(hardReset = false) {
      if (!this.status) return

      this.filesAdded = []

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
        this.suppliersArray = await getSuppliers()
        this.vendorsArray = await getVendors()
        this.productTypesArray = await getProductTypes()
        this.productStatusesArray = await getProductStatuses()
      }
    },
  },
}
</script>
