import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import Vuetify from 'vuetify';
import firebase from 'firebase';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify, {
    iconfont: 'mdi',
});
let app = '';



var config = {
  apiKey: "AIzaSyABucStjYENfSoFConpZILuYbrfmxBIxr8",
  authDomain: "todo-1694d.firebaseapp.com",
  databaseURL: "https://todo-1694d.firebaseio.com",
  projectId: "todo-1694d",
  storageBucket: "todo-1694d.appspot.com",
  messagingSenderId: "730013255792"
};
firebase.initializeApp(config);


Vue.config.productionTip = false;
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});