import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import Vuetify from 'vuetify';
import firebase from 'firebase';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css'
import firestore from 'firebase/firestore'
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
const firebaseApp = firebase.initializeApp(config);
firebaseApp.firestore().settings({timestampsInSnapshots:true})

Vue.config.productionTip = false;
export default firebaseApp.firestore()
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});