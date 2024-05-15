<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>

    <VCard title="Update Data of this Residential">
      <VAlert
        v-model="isAlertVisible"
        closable
        close-label="Close Alert"
        color="error"
      >
        <ul v-for="(value, key) in errors" :key="key">
          <li v-for="(value1, key1) in value" :key="key1">-> {{ value1 }}</li>
        </ul>
        {{ value }}
      </VAlert>
      <VForm ref="formSubmit">
        <VCardText>
          <VRow>
            <VCol cols="12" md="4">
              <label>Residential Image</label>
              <v-file-input
                accept="image/*"
                v-model="image"
                ref="file"
              ></v-file-input>
            </VCol>
            <VCol cols="12" md="4">
              <VAvatar size="48">
                <VImg :src="fetch_photo" />
              </VAvatar>
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                :rules="[globalRequire].flat()"
                v-model="insertData.name"
                label="Name"
              />
            </VCol>
            <VCol cols="12" md="3">
              <AppSelect
                v-model="insertData.type_of_property_id"
                :items="data_fetch_type_of_property"
                :rules="[globalRequire].flat()"
                item-title="no_bhk"
                item-value="id"
                label="Type Of Property"
              />
            </VCol>
            <VCol cols="12" md="3">
              <AppTextField
                :rules="[globalRequire].flat()"
                v-model="insertData.square_yard"
                label="Square Yard"
              />
            </VCol>
            <VCol cols="12" md="3">
              <AppTextField
                :rules="[globalRequire].flat()"
                v-model="insertData.price"
                label="Price"
              />
            </VCol>
            <VCol cols="12" md="3">
              <AppTextField
                :rules="[globalRequire].flat()"
                v-model="insertData.possession"
                label="Possession"
              />
            </VCol>
            <VCol cols="12" md="3">
              <AppSelect
                v-model="insertData.status_id"
                :items="data_fetch_property_status"
                :rules="[globalRequire].flat()"
                item-title="name"
                item-value="id"
                label="Property Status"
              />
            </VCol>
            <VCol cols="12" md="3">
              <AppTextField
                v-model="insertData.shop_square_feet"
                label="Shop Square feet"
              />
            </VCol>
            <VCol cols="12" md="4">
              <v-textarea
                v-model="insertData.description"
                label="Description"
              />
            </VCol>
            <VCol cols="12" md="4">
              <v-textarea v-model="insertData.iframe" label="IFrame" />
            </VCol>
            <VCol cols="12" md="4">
              <v-textarea
                v-model="insertData.location"
                :rules="[globalRequire].flat()"
                label="Location"
              />
            </VCol>
            <VCol cols="12" md="4">
              <VRadioGroup v-model="insertData.status" inline label="Status">
                <VRadio label="Active" :value="1" density="compact" />
                <VRadio label="In-Active" :value="0" density="compact" />
              </VRadioGroup>
            </VCol>
            <VCol cols="12" md="4">
              <label>Brochure</label>
              <v-file-input
                accept="file/*"
                v-model="brochure"
                ref="file1"
              ></v-file-input>
            </VCol>
            <VCol cols="12" md="4">
              <VAvatar size="48">
                <VImg :src="fetch_file" />
              </VAvatar>
            </VCol>
          </VRow>
        </VCardText>
        <VCardText class="d-flex justify-end flex-wrap gap-3">
          <VBtn @click="updateData"> Update </VBtn>
        </VCardText>
      </VForm>
    </VCard>
    <!-- global loader modal -->
    <VDialog v-model="loader" width="300">
      <VCard color="primary" width="300">
        <VCardText class="pt-3">
          loading.........
          <VProgressLinear indeterminate class="mb-0" />
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<script>
import GlobalBreadCrumbsVue from "@/components/common/GlobalBreadCrumbs.vue";
import ls from "localstorage-slim";
import http from "../../http-common";

export default {
  components: {
    GlobalBreadCrumbsVue,
  },
  data() {
    return {
      globalRequire: [
        (value) => {
          if (value) return true;
          return "Required.";
        },
      ],
      nameMin: [
        (value) => {
          if (value?.length >= 3) return true;
          return "Must be at least 3 characters.";
        },
      ],
      image: "",
      fetch_photo: "",
      brochure: "",
      fetch_file: "",
      insertData: {
        name: "",
        description: "",
        type_of_property_id: "",
        square_yard: "",
        price: "",
        possession: "",
        status_id: "",
        shop_square_feet: "",
        iframe: "",
        location: "",
        status: "",
        residential_update: this.$route.params.id,
      },
      residential_show: this.$route.params.id,
      data_fetch_type_of_property: "",
      data_fetch_property_status: "",
      loader: false,
      paramsId: this.$route.params.id,
      errors: {},
      isAlertVisible: false,
      data_fetch_sub_services: "",
      auth: ls.get("user-info", { decrypt: true }),
    };
  },
  created() {
    this.fetchData();
    this.fetch_type_of_property();
    this.fetch_property_status();
  },
  methods: {
    fetch_type_of_property() {
      http
        .get("/type-of-property-listing")
        .then((res) => {
          if (res.data.success) {
            this.data_fetch_type_of_property = res.data.data;
          }
        })
        .catch((e) => {
          this.$toast.error("Something went wrong");
        });
    },
    fetch_property_status() {
      http
        .get("/status-of-property-listing")
        .then((res) => {
          if (res.data.success) {
            this.data_fetch_property_status = res.data.data;
          }
        })
        .catch((e) => {
          this.$toast.error("Something went wrong");
        });
    },
    async fetchData() {
      this.loader = true;
      await http
        .post("/residential/show", { residential_show: this.residential_show })
        .then((res) => {
          if (res.data.success) {
            const resData = res.data.data;
            this.insertData.name = resData.name;
            this.insertData.description = resData.description;
            this.insertData.type_of_property_id = resData.type_of_property_id;
            this.insertData.square_yard = resData.square_yard;
            this.insertData.price = resData.price;
            this.insertData.possession = resData.possession;
            this.insertData.status_id = resData.status_id;
            this.insertData.shop_square_feet = resData.shop_square_feet;
            this.insertData.iframe = resData.iframe;
            this.insertData.location = resData.location;
            this.insertData.status = resData.status;
            this.fetch_photo = resData.image == null ? "" : resData.image;
            this.fetch_file = resData.brochure == null ? "" : resData.brochure;
          }
        })
        .catch((e) => {
          console.log(e);
        });
      this.loader = false;
    },
    async updateData() {
      const checkValidation = await this.$refs.formSubmit.validate();
      if (checkValidation.valid) {
        const formData = new FormData();
        if (this.image) {
          const imageData = this.$refs.file.files[0];
          formData.append("image", imageData);
        } else {
          formData.append("image", "");
        }
        for (let x in this.insertData) {
          formData.append(x, this.insertData[x]);
        }
        if (this.brochure) {
          const imageData1 = this.$refs.file1.files[0];
          formData.append("brochure", imageData1);
        } else {
          formData.append("brochure", "");
        }
        for (let x in this.insertData) {
          formData.append(x, this.insertData[x]);
        }
        this.loader = true;
        http
          .post("residential/update", formData)
          .then((res) => {
            if (res.data.success) {
              this.fetchData();
              this.$toast.success(res.data.message);
              this.$router.push({
                path: "/residential/list/",
              });
              this.isAlertVisible = false;
            } else {
              this.$toast.error(res.data.message);
              this.errors = res.data.data;
              this.isAlertVisible = true;
            }
            this.loader = false;
          })
          .catch((e) => {
            this.loader = false;
          });
      }
    },
  },
};
</script>
