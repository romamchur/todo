<template>
  <v-app dark>
    <v-progress-circular :size="50" color="primary" indeterminate v-if="!profile.uid"></v-progress-circular>
    <router-view v-else></router-view>
  </v-app>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    computed: {
      ...mapGetters(["profile"])
    }
  }
</script>
