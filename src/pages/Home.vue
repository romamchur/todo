<template>
  <div>
    <v-navigation-drawer app fixed permanent>
      <v-list >
        <v-list-tile :to="'/profile'">
          <v-list-tile-action> <v-icon></v-icon> </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>My Profile</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="'/news'">
          <v-list-tile-action> <v-icon></v-icon> </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>News</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="'/inbox'">
          <v-list-tile-action> <v-icon>mdi-inbox-arrow-down</v-icon> </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Inbox</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="'/week'">
          <v-list-tile-action> <v-icon>mdi-calendar-range</v-icon> </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Week</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="'/tags'">
          <v-list-tile-action> <v-icon>mdi-tag-multiple</v-icon> </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Tags</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="'/creatingTeam'">
          <v-list-tile-action> <v-icon>mdi-account-group</v-icon> </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Team</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="'/tasks'">
          <v-list-tile-action> <v-icon>mdi-assignment-turned-in</v-icon> </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Tasks</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed>
      <v-toolbar-title>ToDo</v-toolbar-title>
      <avatar></avatar>
      <v-toolbar-items class="hidden-sm-and-down toolbar-btn" id="t">
        <v-btn @click="SignOut" flat>Log Out</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <v-flex shrink>
            <router-view></router-view>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer app fixed inset> <span>&copy; 2018 Roman Mamchur</span> </v-footer>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import avatar from '../components/avatar.vue'
export default {
  methods: {
    SignOut: function() {
      firebase.auth().signOut().then(
        (user) => {
          this.$router.replace('/login')
        },
        (err) => {
          alert(err.message);
        }
      )
    }
  },
  components : {avatar ,}
}

</script>
<style scoped lang="less">

</style>