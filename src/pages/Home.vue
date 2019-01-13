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
        <v-list-tile :to="'/day'">
          <v-list-tile-action> <v-icon>mdi-calendar-range</v-icon> </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Day</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="'/tags'">
          <v-list-tile-action> <v-icon>mdi-tag-multiple</v-icon> </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Tags</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="'/myTeams'">
          <v-list-tile-action> <v-icon>mdi-account-group</v-icon> </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>My Teams</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        </v-list-tile>
        <v-list-tile :to="'/creatingTeam'">
          <v-list-tile-action> <v-icon>mdi-account-group</v-icon> </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Create team</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="'/tasks'">
          <v-list-tile-action> <v-icon>mdi-flag</v-icon> </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Tasks</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="'/teamChats'">
          <v-list-tile-action> <v-icon>mdi-chat</v-icon> </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Team chat</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        </v-list-tile>
        <v-list-tile :to="'/privateChats'">
          <v-list-tile-action> <v-icon>mdi-chat</v-icon> </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Private chat</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed color="primary">
      <v-toolbar-title>ToDo</v-toolbar-title>
      <avatar></avatar>
      <v-btn flat small id="notifications-icon"  :to="'/notifications'" ><v-icon  >mdi-lightbulb-on-outline</v-icon></v-btn>
    
      <v-toolbar-items class="hidden-sm-and-down toolbar-bt'n"  >
        <v-btn @click="SignOut" flat id="logOutBtn">Log Out</v-btn>
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
<style scoped >
  #logOutBtn {
    position:absolute;
    right: 2%;
  }
  #notifications-icon{
    position:absolute;
    right:8%;
    top:17%
  }
  #account-icon{
    position:absolute;
    right:12%;
    top:17%;
  }

</style>
