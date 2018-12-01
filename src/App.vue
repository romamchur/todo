
<template>
  <v-app id="inspire" dark>
    <v-navigation-drawer
            v-model="drawer"
            clipped
            fixed
            app
    >
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left class="td-toolbar">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <avatar></avatar>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
      </v-container>
    </v-content>
    <v-footer app fixed>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
  import avatar from './components/avatar.vue';

export default {
    data: () => ({
        drawer: null
    }),
    props: {
        source: String
    },
    components: { avatar }
}
</script>
<style scoped lang="less">
  .v-toolbar__content {
      display: flex;
      justify-content: space-between;
    }
</style>
