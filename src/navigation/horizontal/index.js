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

const manageSiteSetting = {
  title: "Site Setting",
  to: { name: "siteSetting" },
  icon: { icon: "tabler-settings" },
};
route.push(manageSiteSetting);

const manageAboutUs = {
  title: "About Us",
  to: { name: "aboutUs" },
  icon: { icon: "tabler-hierarchy-3" },
};
route.push(manageAboutUs);

const manageContactUs = {
  title: "Contact Us",
  to: { name: "contactUs" },
  icon: { icon: "tabler-phone" },
};
route.push(manageContactUs);

const manageResidentialInquiry = {
  title: "Residential Inquiry",
  to: { name: "residentialInquiry" },
  icon: { icon: "tabler-phone" },
};
route.push(manageResidentialInquiry);

const manageAmenity = {
  title: "Amenity",
  to: null,
  icon: { icon: "tabler-list" },
  children: [
    {
      title: "Add",
      to: { name: "amenity-add" },
    },
    {
      title: "List",
      to: { name: "amenity-list" },
    },
  ],
};
route.push(manageAmenity);

const manageResidential = {
  title: "Residential",
  to: null,
  icon: { icon: "tabler-building" },
  children: [
    {
      title: "Add",
      to: { name: "residential-add" },
    },
    {
      title: "List",
      to: { name: "residential-list" },
    },
  ],
};
route.push(manageResidential);

const managePlot = {
  title: "Plot",
  to: null,
  icon: { icon: "tabler-crop-1-1" },
  children: [
    {
      title: "Add",
      to: { name: "plot-add" },
    },
    {
      title: "List",
      to: { name: "plot-list" },
    },
  ],
};
route.push(managePlot);

const manageCommercial = {
  title: "Commercial",
  to: null,
  icon: { icon: "tabler-building-community" },
  children: [
    {
      title: "Add",
      to: { name: "commercial-add" },
    },
    {
      title: "List",
      to: { name: "commercial-list" },
    },
  ],
};
route.push(manageCommercial);

const manageGallery = {
  title: "Gallery",
  to: null,
  icon: { icon: "tabler-photo" },
  children: [
    {
      title: "Add",
      to: { name: "gallery-add" },
    },
    {
      title: "List",
      to: { name: "gallery-list" },
    },
  ],
};
route.push(manageGallery);

const manageOurTeam = {
  title: "Our Team",
  to: null,
  icon: { icon: "tabler-users-group" },
  children: [
    {
      title: "Add",
      to: { name: "ourTeam-add" },
    },
    {
      title: "List",
      to: { name: "ourTeam-list" },
    },
  ],
};
route.push(manageOurTeam);

export default route;
