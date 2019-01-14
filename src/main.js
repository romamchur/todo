import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import Vuetify from "vuetify";
import { initFirebase } from "./firebase";

import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify, { iconfont: "mdi" });
Vue.config.productionTip = false;

initFirebase(store);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
