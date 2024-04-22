<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
    <VCard title="Add Commercial">
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
            <VCol cols="12" md="4">
              <AppTextField
                :rules="[globalRequire].flat()"
                v-model="insertData.square_feet"
                label="Square Feet"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppSelect
                v-model="insertData.status_id"
                :items="data_fetch_property_status"
                :rules="[globalRequire].flat()"
                item-title="name"
                item-value="id"
                label="Property Status"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppSelect
                v-model="insertData.commercial_type_id"
                :items="data_fetch_commercial_type"
                :rules="[globalRequire].flat()"
                item-title="type"
                item-value="id"
                label="Type Of Commercial"
              />
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
      insertData: {
        iframe: "",
        location: "",
        square_feet: "",
        status_id: "",
        commercial_type_id: "",
      },
      data_fetch_property_status: "",
      data_fetch_commercial_type: "",
      loader: false,
      errors: {},
      isAlertVisible: false,
    };
  },
  created() {
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
    async saveData() {
      const checkValidation = await this.$refs.formSubmit.validate();
      if (checkValidation.valid) {
        this.loader = true;
        http
          .post("/commercial/store", this.insertData)
          .then((res) => {
            if (res.data.success) {
              this.$router.push({
                path: "/commercial/list/",
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
