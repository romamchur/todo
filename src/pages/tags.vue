<template>
  <div class="background">
    <v-layout row full-width>
      <v-flex full-width>
        <v-card full-width>
          <v-toolbar color="dark" dark>
            <v-toolbar-title>Favourite Tasks</v-toolbar-title>
          </v-toolbar>
          <v-list light full-width>
            <v-list-tile v-for="task in tasks">
              <v-list-tile-content full-width>
                <v-list-tile-title full-width>
                  <v-icon @click="deleteTag(task)">mdi-star</v-icon>
                  <span id="name">{{ task.name }}</span>
                  <v-icon id="teamIcon">mdi-account-group</v-icon>
                  <span id="team">{{ task.team.value }}</span>
                  <v-icon id="CalendarIcon">mdi-calendar-range</v-icon>
                  <span id="Date">{{ task.date }}</span>
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import firebase from "firebase";
export default {
  data() {
    return {
      tasks: []
    };
  },
  methods: {
    deleteTag: function(task) {
      var tempTeams;
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i] == task) {
          this.tasks.splice(i, 1);
          let id = firebase.auth().currentUser.uid;
          firebase
            .database()
            .ref("users/" + id + "/teams" + "/team")
            .once("value", function(snapshot) {
              tempTeams = snapshot.val();
            });
          for (let i = 0; i < tempTeams.length; i++) {
            for (let j = 0; j < tempTeams[i].tasks.length; j++) {
              console.log(tempTeams[i].tasks[j].name);
              console.log(task.name);
              if (
                task.name == tempTeams[i].tasks[j].name &&
                task.team.value == tempTeams[i].tasks[j].team.value
              ) {
                var indexTeam = i;
                var indexTask = j;
                break;
              }
            }
          }
          firebase
            .database()
            .ref("users/" + id + "/teams" + "/team")
            .child(indexTeam)
            .child("/tasks")
            .child(indexTask)
            .child("main")
            .set({
              main: false
            });
        }
      }
    }
  },
  created() {
    let user = firebase.auth().currentUser;
    let that = this;
    this.tasks = [];
    firebase
      .database()
      .ref("users/" + user.uid + "/teams" + "/team")
      .once("value", function(snapshot) {
        console.log(snapshot.val());
        for (let i = 0; i < snapshot.val().length; i++) {
          for (let j = 0; j < snapshot.val()[i].tasks.length; j++) {
            if (snapshot.val()[i].tasks[j].main.main) {
              that.tasks.push(snapshot.val()[i].tasks[j]);
              console.log(that.tasks);
            }
          }
        }
      });
  }
};
</script>
<style scoped>
.background {
  position: absolute;
  top: 10%;
  left: 10%;
  width: 88%;
}
#name {
  position: absolute;
  left: 10%;
}
#teamIcon {
  position: absolute;
  left: 35%;
}
#team {
  position: absolute;
  left: 39%;
}
#CalendarIcon {
  position: absolute;
  left: 80%;
}
#Date {
  position: absolute;
  left: 85%;
}
</style>
