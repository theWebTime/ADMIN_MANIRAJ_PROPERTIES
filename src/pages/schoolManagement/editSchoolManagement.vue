<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>

    <VCard title="Update Data of this School">
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
                label="Service (you can select multiple
                  options)"
                multiple
                chips
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppSelect
                v-model="insertData.sse"
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
            <VCol cols="12" md="4" v-if="auth.role == 1">
              <VRadioGroup
                v-model="insertData.top_rating"
                inline
                label="Top Rating"
              >
                <VRadio label="Yes" :value="1" density="compact" />
                <VRadio label="No" :value="0" density="compact" />
              </VRadioGroup>
            </VCol>
            <VCol cols="12" md="4">
              <VRadioGroup v-model="insertData.status" inline label="Status">
                <VRadio label="Active" :value="1" density="compact" />
                <VRadio label="In-Active" :value="0" density="compact" />
              </VRadioGroup>
            </VCol>
            <VCol cols="12" md="6">
              <v-file-input
                accept="image/*"
                v-model="image"
                label="Image"
                ref="file"
              ></v-file-input>
            </VCol>
            <VCol cols="12" md="6">
              <VAvatar size="48">
                <VImg :src="fetch_photo" />
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
import http from "../../http-common";
import ls from "localstorage-slim";

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
      insertData: {
        service_id: [],
        se: [],
        sub_services_id: [],
        sse: [],
        country_id: "",
        state_id: "",
        city_id: "",
        school_name: "",
        address: "",
        area: "",
        iframe: "",
        contact_number: "",
        email: "",
        top_rating: "",
        detail: "",
        term_condition: "",
        status: "",
      },
      fetchingState: "",
      fetchingCity: "",
      fetchingSubServices: "", //
      data_fetch_services: "",
      data_fetch_countries: "",
      data_fetch_states: "",
      data_fetch_cities: "",
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
    this.fetch_services();
    this.fetch_countries();
    // this.fetch_sub_services();
    /* this.fetch_states();
    this.fetch_cities(); */
  },
  watch: {
    fetchingState: function (newValue) {
      if (this.insertData.country_id != newValue) {
        this.fetchingCity = "";
        this.insertData.city_id = "";
      }
      this.insertData.country_id = newValue;
      this.fetch_states();
    },
    fetchingCity: function (newValue) {
      if (this.insertData.state_id != newValue) {
        this.insertData.city_id = "";
      }
      this.insertData.state_id = newValue;
      // this.insertData.state_id = newValue;
      this.fetch_cities();
    },

    fetchingSubServices: function (newValue) {
      // alert(this.insertData.service_id);
      // alert(newValue);
      if (this.insertData.service_id != newValue) {
        this.insertData.sse = null;
      }
      this.insertData.service_id = newValue;
      this.insertData.se = newValue;
      // this.insertData.sse = "";
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
      const value = this.insertData.se;
      http
        .post("/sub-service-fetch-by-service-index", {
          service_id: value,
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
            this.fetch_cities();
          }
        })
        .catch((e) => {
          this.$toast.error("Something went wrong");
        });
    },
    fetch_cities() {
      http
        .get("/city-index/" + +this.insertData.state_id)
        .then((res) => {
          if (res.data.success) {
            this.data_fetch_cities = res.data.data;
          }
        })
        .catch((e) => {
          this.$toast.error("Something went wrong");
        });
    },
    async fetchData() {
      this.loader = true;
      await http
        .get("/school-management/show/" + this.paramsId)
        .then((res) => {
          if (res.data.success) {
            const resData = res.data.data;
            this.insertData.school_name = resData.school_name;
            this.insertData.address = resData.address;
            this.insertData.area = resData.area;
            this.insertData.iframe = resData.iframe;
            this.insertData.contact_number = resData.contact_number;
            this.insertData.email = resData.email;
            this.insertData.service_id = resData.service_id;
            this.insertData.se = resData.se;
            this.fetchingSubServices = resData.se;
            this.insertData.sub_services_id = resData.sub_services_id;
            this.insertData.sse = resData.sse;
            this.insertData.country_id = resData.country_id;
            this.fetchingState = resData.country_id;
            this.insertData.state_id = resData.state_id;
            this.fetchingCity = resData.state_id;
            this.insertData.city_id = resData.city_id;
            this.insertData.top_rating = resData.top_rating;
            this.insertData.detail = resData.detail;
            this.insertData.term_condition = resData.term_condition;
            this.insertData.status = resData.status;
            this.fetch_photo = resData.image;
            this.fetch_states();
            this.fetch_sub_services();
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
        this.loader = true;
        http
          .post("school-management/update/" + this.paramsId, formData)
          .then((res) => {
            if (res.data.success) {
              this.fetchData();
              this.$toast.success(res.data.message);
              this.$router.push({
                path: "/schoolManagement/list/",
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
