<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>

    <VCard title="Update Data of this Commercial">
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
              <AppTextField
                :rules="[globalRequire].flat()"
                v-model="insertData.square_feet"
                label="Square Feet"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppSelect
                v-model="insertData.status_id"
                :items="data_fetch_property_status"
                :rules="[globalRequire].flat()"
                item-title="name"
                item-value="id"
                label="Property Status"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppSelect
                v-model="insertData.commercial_type_id"
                :items="data_fetch_commercial_type"
                :rules="[globalRequire].flat()"
                item-title="type"
                item-value="id"
                label="Type Of Commercial"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VRadioGroup v-model="insertData.status" inline label="Status">
                <VRadio label="Active" :value="1" density="compact" />
                <VRadio label="In-Active" :value="0" density="compact" />
              </VRadioGroup>
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
      insertData: {
        iframe: "",
        location: "",
        square_feet: "",
        status_id: "",
        status: "",
        commercial_type_id: "",
        commercial_update: this.$route.params.id,
      },
      commercial_show: this.$route.params.id,
      data_fetch_property_status: "",
      data_fetch_commercial_type: "",
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
    this.fetch_property_status();
    this.fetch_commercial_type();
  },
  methods: {
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
    fetch_commercial_type() {
      http
        .get("/commercial-property-listing")
        .then((res) => {
          if (res.data.success) {
            this.data_fetch_commercial_type = res.data.data;
          }
        })
        .catch((e) => {
          this.$toast.error("Something went wrong");
        });
    },
    async fetchData() {
      this.loader = true;
      await http
        .post("/commercial/show", { commercial_show: this.commercial_show })
        .then((res) => {
          if (res.data.success) {
            const resData = res.data.data;
            this.insertData.iframe = resData.iframe;
            this.insertData.location = resData.location;
            this.insertData.square_feet = resData.square_feet;
            this.insertData.status_id = resData.status_id;
            this.insertData.commercial_type_id = resData.commercial_type_id;
            this.insertData.status = resData.status;
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
        this.loader = true;
        http
          .post("commercial/update", this.insertData)
          .then((res) => {
            if (res.data.success) {
              this.fetchData();
              this.$toast.success(res.data.message);
              this.$router.push({
                path: "/commercial/list/",
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
