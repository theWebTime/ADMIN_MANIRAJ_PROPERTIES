<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>

    <VCard title="Update Data of this User">
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
              <AppTextField
                :rules="[globalRequire, nameMin].flat()"
                v-model="insertData.title"
                label="Title"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.amount"
                type="number"
                :rules="[globalRequire].flat()"
                label="Amount"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.total_days"
                :rules="[globalRequire].flat()"
                type="number"
                label="Total Days"
              />
            </VCol>
            <VCol cols="12" md="6">
              <v-textarea
                v-model="insertData.terms_and_condition"
                :rules="[globalRequire].flat()"
                label="Terms and Conditions"
              /> </VCol
            ><VCol cols="12" md="6">
              <v-textarea
                v-model="insertData.description"
                :rules="[globalRequire].flat()"
                label="Description"
              />
            </VCol>
            <VCol cols="12" md="4">
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
import http from "../../../http-common";
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
      fetch_photo: "",
      insertData: {
        title: "",
        amount: "",
        total_days: "",
        terms_and_condition: "",
        description: "",
        status: "",
      },
      loader: false,
      paramsId: this.$route.params.id,
      errors: {},
      isAlertVisible: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loader = true;
      await http
        .get("/school-plan/show/" + this.paramsId)
        .then((res) => {
          if (res.data.success) {
            const resData = res.data.data;
            this.insertData.title = resData.title;
            this.insertData.amount = resData.amount;
            this.insertData.total_days = resData.total_days;
            this.insertData.terms_and_condition = resData.terms_and_condition;
            this.insertData.description = resData.description;
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
      this.loader = true;
      http
        .post("school-plan/update/" + this.paramsId, this.insertData)
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
    },
  },
};
</script>
