<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
    <br />
    <VDivider />
    <VCard>
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
          <h3>Update Site Setting</h3>
          <br />
          <VRow>
            <VCol cols="12" md="6">
              <v-file-input
                accept="image/*"
                v-model="logo"
                label="Logo"
                ref="file"
              ></v-file-input>
            </VCol>
            <VCol cols="12" md="6">
              <VAvatar size="48">
                <VImg :src="fetch_photo" />
              </VAvatar>
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.email1"
                :rules="[globalRequire, email].flat()"
                label="Email"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.email2"
                :rules="[email].flat()"
                label="Second Email"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.phone_number1"
                type="number"
                label="Phone Number"
                :rules="[globalRequire].flat()"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.phone_number2"
                type="number"
                label="Phone Number 2"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.address"
                :rules="[globalRequire].flat()"
                label="Street Address"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.facebook_link"
                label="Facebook Link"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.instagram_link"
                label="Instagram Link"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.youtube_link"
                label="Youtube Link"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.whatsapp_number"
                type="number"
                :rules="[globalRequire].flat()"
                label="Whatsapp Number"
              />
            </VCol>
            <VCol cols="12" md="6">
              <v-textarea v-model="insertData.iframe" label="Iframe" />
            </VCol>
            <VCol cols="12" md="6">
              <v-textarea v-model="insertData.video_link" label="Video Link" />
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
import http from "../http-common";
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
      email: [
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Email must be valid",
      ],
      logo: "",
      fetch_photo: "",
      insertData: {
        email1: "",
        email2: "",
        phone_number1: "",
        phone_number2: "",
        address: "",
        facebook_link: "",
        instagram_link: "",
        youtube_link: "",
        whatsapp_number: "",
        iframe: "",
        video_link: "",
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
    fetchData() {
      this.loader = true;
      http
        .get("/user-side/site-setting-show")
        .then((res) => {
          if (res.data.success) {
            this.insertData.email1 = null ? "" : res.data.data.email1;
            this.insertData.email2 = null ? "" : res.data.data.email2;
            this.insertData.phone_number1 = null
              ? ""
              : res.data.data.phone_number1;
            this.insertData.phone_number2 = null
              ? ""
              : res.data.data.phone_number2;
            this.insertData.address = null ? "" : res.data.data.address;
            this.insertData.facebook_link = null
              ? ""
              : res.data.data.facebook_link;
            this.insertData.instagram_link = null
              ? ""
              : res.data.data.instagram_link;
            this.insertData.youtube_link = null
              ? ""
              : res.data.data.youtube_link;
            this.insertData.whatsapp_number = null
              ? ""
              : res.data.data.whatsapp_number;
            this.insertData.iframe = null ? "" : res.data.data.iframe;
            this.insertData.video_link = null ? "" : res.data.data.video_link;
            this.fetch_photo =
              res.data.data.logo == null ? "" : res.data.data.logo;
          }
          this.loader = false;
        })
        .catch((e) => {
          this.loader = false;
          console.log(e);
        });
    },
    async updateData() {
      const checkValidation = await this.$refs.formSubmit.validate();
      if (checkValidation.valid) {
        const formData = new FormData();
        if (this.logo) {
          const imageData = this.$refs.file.files[0];
          formData.append("logo", imageData);
        } else {
          formData.append("logo", "");
        }
        for (let x in this.insertData) {
          formData.append(x, this.insertData[x]);
        }
        this.loader = true;
        http
          .post("site-setting/store", formData)
          .then((res) => {
            if (res.data.success) {
              this.fetchData();
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
          });
      }
    },
  },
};
</script>
