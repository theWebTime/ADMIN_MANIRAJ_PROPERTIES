<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
    <VCard title="Add Residential">
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
            <VCol cols="12" md="6">
              <label>Residential Image</label>
              <v-file-input
                accept="image/*"
                v-model="image"
                ref="file"
              ></v-file-input>
            </VCol>
            <VCol cols="12" md="6">
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
                label="Type Of Property (you can select multiple
                options)"
                multiple
                chips
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
            <VCol cols="12" md="6">
              <v-textarea
                v-model="insertData.description"
                label="Description"
              />
            </VCol>
            <VCol cols="12" md="6">
              <v-textarea v-model="insertData.iframe" label="IFrame" />
            </VCol>
            <VCol cols="12" md="6">
              <v-textarea
                v-model="insertData.location"
                :rules="[globalRequire].flat()"
                label="Location"
              />
            </VCol>
            <VCol cols="12" md="6">
              <label>Brochure</label>
              <v-file-input
                accept="file/*"
                v-model="brochure"
                ref="file1"
              ></v-file-input>
            </VCol>
          </VRow>
        </VCardText>
        <VCardText class="d-flex justify-end flex-wrap gap-3">
          <VBtn @click="saveData"> Save </VBtn>
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
      email: [
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Email must be valid",
      ],
      brochure: "",
      image: "",
      insertData: {
        name: "",
        description: "",
        type_of_property_id: [],
        // top: [],
        square_yard: "",
        price: "",
        possession: "",
        status_id: "",
        shop_square_feet: "",
        iframe: "",
        location: "",
      },
      data_fetch_type_of_property: "",
      data_fetch_property_status: "",
      loader: false,
      errors: {},
      isAlertVisible: false,
    };
  },
  created() {
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
    async saveData() {
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
          .post("/residential/store", formData)
          .then((res) => {
            if (res.data.success) {
              this.$router.push({
                path: "/residential/list/",
              });
              this.$toast.success(res.data.message);
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
            console.log(e);
          });
      }
    },
  },
};
</script>
