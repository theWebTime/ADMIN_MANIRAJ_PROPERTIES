import router from "@/router";
import ls from "localstorage-slim";

const auth = ls.get("user-info", { decrypt: true });
if (!auth) {
  router.push("/");
}

var route = [
  {
    title: "Dashboard",
    to: { name: "dashboard" },
    icon: { icon: "tabler-smart-home" },
  },
];

const manageSchoolManagement = {
  title: "School Management",
  to: null,
  icon: { icon: "tabler-building-skyscraper" },
  children: [
    {
      title: "Add",
      to: { name: "schoolManagement-add" },
    },
    {
      title: "List",
      to: { name: "schoolManagement-list" },
    },
  ],
};
route.push(manageSchoolManagement);
if (auth.role == 1) {
  const manageUser = {
    title: "User",
    to: null,
    icon: { icon: "tabler-user" },
    children: [
      {
        title: "Add",
        to: { name: "user-add" },
      },
      {
        title: "List",
        to: { name: "user-list" },
      },
    ],
  };
  route.push(manageUser);

  const manageBannerAndMiniBanner = {
    title: "Banner & Mini Banner",
    to: null,
    icon: { icon: "tabler-photo" },
    children: [
      {
        title: "Add",
        to: { name: "bannerAndMiniBanner-add" },
      },
      {
        title: "List",
        to: { name: "bannerAndMiniBanner-list" },
      },
    ],
  };
  route.push(manageBannerAndMiniBanner);

  const manageService = {
    title: "Service",
    to: null,
    icon: { icon: "tabler-list-numbers" },
    children: [
      {
        title: "Add",
        to: { name: "service-add" },
      },
      {
        title: "List",
        to: { name: "service-list" },
      },
    ],
  };
  route.push(manageService);

  const manageBlog = {
    title: "Blog",
    to: null,
    icon: { icon: "tabler-article" },
    children: [
      {
        title: "Add",
        to: { name: "blog-add" },
      },
      {
        title: "List",
        to: { name: "blog-list" },
      },
    ],
  };
  route.push(manageBlog);

  const manageEvent = {
    title: "Event",
    to: null,
    icon: { icon: "tabler-calendar-check" },
    children: [
      {
        title: "Add",
        to: { name: "event-add" },
      },
      {
        title: "List",
        to: { name: "event-list" },
      },
    ],
  };
  route.push(manageEvent);

  const manageEventSpeaker = {
    title: "Event Speaker",
    to: null,
    icon: { icon: "tabler-calendar-event" },
    children: [
      {
        title: "Add",
        to: { name: "eventSpeaker-add" },
      },
      {
        title: "List",
        to: { name: "eventSpeaker-list" },
      },
    ],
  };
  route.push(manageEventSpeaker);

  const manageTestimonial = {
    title: "Testimonial",
    to: null,
    icon: { icon: "tabler-message-2-check" },
    children: [
      {
        title: "Add",
        to: { name: "testimonial-add" },
      },
      {
        title: "List",
        to: { name: "testimonial-list" },
      },
    ],
  };
  route.push(manageTestimonial);

  const manageAboutUs = {
    title: "About Us",
    to: { name: "aboutUs" },
    icon: { icon: "tabler-info-circle" },
  };
  route.push(manageAboutUs);

  const manageContactUs = {
    title: "Contact Us",
    to: { name: "contactUs" },
    icon: { icon: "tabler-phone-call" },
  };
  route.push(manageContactUs);

  const manageSiteSetting = {
    title: "Site Setting",
    to: { name: "siteSetting" },
    icon: { icon: "tabler-settings" },
  };
  route.push(manageSiteSetting);

  const manageSchoolOwnerDetail = {
    title: "School Owner Detail",
    to: { name: "schoolOwnerDetail" },
    icon: { icon: "tabler-file-description" },
  };
  route.push(manageSchoolOwnerDetail);

  const manageSeoManagement = {
    title: "Seo Management",
    to: { name: "seoManagement" },
    icon: { icon: "tabler-seo" },
  };
  route.push(manageSeoManagement);
}

export default route;
