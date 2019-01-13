<template>
    <div>
    <v-flex full-width>
        <v-layout row>
            <v-flex full-width>
                <v-card>
                    <v-toolbar color="dark" dark>
                        <v-toolbar-title>My Teams</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-list light>
                        <v-list-tile
                                v-for="team in teams"
                                :key="team.name"
                                avatar
                                @click="openDialog(team)"
                        >
                            <v-list-tile-content>
                                <v-list-tile-title v-text="team.name.value"></v-list-tile-title>
                            </v-list-tile-content>

                            <v-list-tile-avatar>
                                <img :src="team.avatar">
                            </v-list-tile-avatar>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>
</v-flex>
        <v-dialog
                v-model="dialog"
                width="500"
        >
            <v-card>
                <v-flex >
                    <v-text-field
                            v-model="name"
                            label="New name of team"
                            solo
                            light
                    ></v-text-field>
                </v-flex>
                <v-btn
                    light
                    @click="Rename"
                >
                    Rename
                </v-btn>
                <v-btn
                        warning
                        @click="DeleteTeam(team)"
                >
                    Delete team
                </v-btn>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import  firebase from 'firebase'
export default {
  data() {
    return {
      name:null,
      dialog:false,
      currentTeam:null,
      teams: [

      ],
      tempTeams:[],
    }
  },
  methods : {
    openDialog: function(team) {
      console.log(team)
      console.log(team.creator.uid);
      console.log(firebase.auth().currentUser.uid)
      if (firebase.auth().currentUser.uid == team.creator.uid) {
        this.dialog = true
        this.name = team.name.value;
        this.currentTeam = team;
        console.log(team);
      } else {
        alert('Вибачте але ви не маєте прав достуву так як ви не створювач цієї команди')
      }
    },
    Rename: function() {
      var that = this;
      for (let i = 0; i < this.currentTeam.teammates.length; i++) {
        let id = this.currentTeam.teammates[i].uid
        firebase.database().ref('users/' + id + '/teams' + '/team').on('value', function(snapshot) {
          that.tempTeams = snapshot.val()
        })
        console.log(this.tempTeams)
        console.log(this.tempTeams)
        for (let j = 0; j < that.teams.length; j++) {
          console.log('working')
          console.log('that.tempTeams[j]', that.tempTeams[j])
          console.log(that.currentTeam)
          if (that.tempTeams[j].name.value == that.currentTeam.name.value) {
            var index = j;
            break;
          }
        }
        console.log('index:', index);
        console.log('index:', index);
        this.teams[index].name.value = this.name;
        firebase.database().ref('users/' + id + '/teams' + '/team').child(index).child('name').set({
          value: this.name
        })
      }
      this.dialog = false;
    },
    DeleteTeam: function(team) {
      var that = this;
      console.log(this.currentTeam.teammates)
      for (let i = 0; i < this.currentTeam.teammates.length; i++) {
        let id = this.currentTeam.teammates[i].uid
        firebase.database().ref('users/' + id + '/teams' + '/team').on('value', function(snapshot) {
          that.tempTeams = snapshot.val()
        });
        for(let j=0;j<that.tempTeams.length;j++){
          console.log('this.currentTeam:',this.currentTeam);
          console.log('thath.tempTeams:',that.tempTeams[j])
           if(that.tempTeams[j].name.value==this.currentTeam.name.value){
                if(that.tempTeams[j].teammates.length>1) {
                  that.tempTeams.splice(j, 1);
                  that.teams.splice(j,1);
                } else{
                  alert('Ви не можете видалити індивальну категорію!')
                }
           }
            firebase.database().ref('users/'+id+'/teams').set({
              team:that.tempTeams
            })

        }
      }
      }
    },

  created(){
    let user = firebase.auth().currentUser
    let that = this;
    firebase.database().ref('users/'+user.uid+'/teams'+'/team').once('value',function(snapshot) {
      let teams_info = snapshot.val()
      console.log('teams_info:',teams_info)
     that.teams = teams_info;
      console.log(that.teams);
    })
  }
}
</script>
