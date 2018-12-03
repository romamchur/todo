<template>
  <div>
    <v-navigation-drawer app fixed permanent>
      <v-list >
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
        <v-list-tile :to="'/team'">
          <v-list-tile-action> <v-icon>mdi-account-group</v-icon> </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Team</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed>
      <v-toolbar-title>ToDo</v-toolbar-title>
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
    <v-footer app fixed inset> <span>&copy; 2018</span> </v-footer>
  </div>
</template>

<script>
export default {
};
</script>
