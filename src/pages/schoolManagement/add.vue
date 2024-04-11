<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
    <VCard title="Add School">
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
              <AppSelect
                v-model="fetchingSubServices"
                :items="data_fetch_services"
                item-title="title"
                item-value="id"
                label="Services (you can select multiple
                  options)"
                multiple
                chips
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppSelect
                v-model="insertData.sub_services_id"
                :items="data_fetch_sub_services"
                item-title="title"
                item-value="id"
                label="Sub Services (you can select multiple
                  options)"
                multiple
                chips
              />
            </VCol>
            <VCol cols="12" md="4">
              <label
                >Google Business Place Id
                <a
                  href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                  target="_blank"
                >
                  (Click to get Place Id)</a
                ></label
              >
              <AppTextField v-model="insertData.place_id" />
            </VCol>
            <VCol cols="12" md="4">
              <AppSelect
                v-model="fetchingState"
                :items="data_fetch_countries"
                :rules="[globalRequire].flat()"
                item-title="name"
                item-value="id"
                label="Country"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppSelect
                v-model="fetchingCity"
                :items="data_fetch_states"
                :rules="[globalRequire].flat()"
                item-title="name"
                item-value="id"
                label="State"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppSelect
                v-model="insertData.city_id"
                :items="data_fetch_cities"
                :rules="[globalRequire].flat()"
                item-title="name"
                item-value="id"
                label="City"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                :rules="[globalRequire].flat()"
                v-model="insertData.school_name"
                label="School Name"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                :rules="[globalRequire].flat()"
                v-model="insertData.area"
                label="Area"
              />
            </VCol>
            <VCol cols="12" md="4">
              <v-textarea
                v-model="insertData.address"
                :rules="[globalRequire].flat()"
                label="Address"
              />
            </VCol>
            <VCol cols="12" md="4">
              <v-textarea
                v-model="insertData.iframe"
                :rules="[globalRequire].flat()"
                label="IFrame"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.contact_number"
                :rules="[globalRequire].flat()"
                type="number"
                label="Contact Number"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.email"
                :rules="[globalRequire, email].flat()"
                label="Email"
              />
            </VCol>
            <VCol cols="12" md="4">
              <v-textarea v-model="insertData.detail" label="Detail" />
            </VCol>
            <VCol cols="12" md="4">
              <v-textarea
                v-model="insertData.term_condition"
                label="Term & Condition"
              />
            </VCol>
            <VCol cols="12" md="6">
              <v-file-input
                accept="image/*"
                v-model="image"
                label="Image"
                ref="file"
                :rules="[globalRequire, twoMb].flat()"
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
      image: "",
      insertData: {
        service_id: [],
        sub_services_id: [],
        country_id: "",
        state_id: "",
        city_id: "",
        school_name: "",
        place_id: "",
        address: "",
        area: "",
        iframe: "",
        contact_number: "",
        email: "",
        detail: "",
        term_condition: "",
      },
      fetchingState: "",
      fetchingCity: "",
      fetchingSubServices: null,
      data_fetch_services: "",
      data_fetch_sub_services: "",
      data_fetch_countries: "",
      data_fetch_states: "",
      data_fetch_cities: "",
      loader: false,
      errors: {},
      isAlertVisible: false,
    };
  },
  created() {
    this.fetch_services();
    this.fetch_countries();
  },
  watch: {
    fetchingState: function (newValue) {
      this.insertData.country_id = newValue;
      this.fetch_states();
    },
    fetchingCity: function (newValue) {
      this.insertData.state_id = newValue;
      this.fetch_cities();
    },
    fetchingSubServices: function (newValue) {
      this.insertData.service_id = newValue;
      this.fetch_sub_services();
    },
  },
  methods: {
    fetch_services() {
      http
        .get("/service-index")
        .then((res) => {
          if (res.data.success) {
            this.data_fetch_services = res.data.data;
          }
        })
        .catch((e) => {
          this.$toast.error("Something went wrong");
        });
    },
    fetch_sub_services() {
      http
        .post("/sub-service-fetch-by-service-index", {
          service_id: this.insertData.service_id,
        })
        .then((res) => {
          if (res.data.success) {
            this.data_fetch_sub_services = res.data.data;
          }
        })
        .catch((e) => {
          this.$toast.error("Something went wrong");
        });
    },
    fetch_countries() {
      http
        .get("/country-index")
        .then((res) => {
          if (res.data.success) {
            this.data_fetch_countries = res.data.data;
          }
        })
        .catch((e) => {
          this.$toast.error("Something went wrong");
        });
    },
    fetch_states() {
      http
        .get("/state-index/" + this.insertData.country_id)
        .then((res) => {
          if (res.data.success) {
            this.data_fetch_states = res.data.data;
          }
        })
        .catch((e) => {
          this.$toast.error("Something went wrong");
        });
    },
    fetch_cities() {
      http
        .get("/city-index/" + this.insertData.state_id)
        .then((res) => {
          if (res.data.success) {
            this.data_fetch_cities = res.data.data;
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
        this.loader = true;
        http
          .post("/school-management/store", formData)
          .then((res) => {
            if (res.data.success) {
              this.$router.push({
                path: "/schoolManagement/list/",
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
