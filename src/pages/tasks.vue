<template>
    <v-container >
        <v-layout xs12 >
            <v-flex >
                <v-card xs12>
                    <v-list light full-width>
                        <v-list-tile full-width
                                v-for="team in teams"
                                avatar
                                @click="showMenu(team)"
                        >
                            <v-list-tile-content full-width>
                                <v-list-tile-title v-text="team.name"></v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-avatar>
                                <img :src="team.avatar">
                            </v-list-tile-avatar>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>
    <v-dialog
            v-model="dialogTask"
            width="500"
    >
        <v-card>
            <v-card-title>
                <v-text-field
                        v-model="nameOfTask"
                        label="Name of task"
                        solo
                        dark
                >
                </v-text-field>
            <div>
                <v-date-picker v-model="picker" :landscape="true" :reactive="true"></v-date-picker>
                <v-time-picker v-model="pickerTime" :landscape="true"></v-time-picker>
            </div>
            </v-card-title>
                <v-btn
                        color="primary"
                        flat
                        @click="addTask"
                >
                     Accept
                </v-btn>
            <v-btn
                    color="primary"
                    flat
                    @click="dialogTask = false"
            >
                Cancel
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog >
        <v-dialog light
                v-model="dialogTeam"
                width="960"
        >
            <v-flex full-width>
                <v-toolbar light>
                    <v-spacer></v-spacer>
                    <v-toolbar-items class="hidden-sm-and-down">
                        <v-btn @click="showTasks" flat>Tasks</v-btn>
                        <v-btn @click="showTeammeates"flat>Teammaetes</v-btn>
                        <v-btn @click="showInformation"flat>Information</v-btn>
                        <v-btn @click="showHistory"flat>History</v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <div v-if="flagTasks">
                <v-layout row>
                    <v-flex full-width>
                        <v-card>
                            <v-toolbar color="dark" dark>
                                <v-toolbar-title>My Teams</v-toolbar-title>
                                <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-list light>
                                <v-list-tile
                                        v-for="task in tasks"
                                        avatar
                                >
                                    <v-icon>mdi-calendar-range</v-icon>
                                    <span id="Spans">{{task.date}}</span>
                                        <v-list-tile-title v-text="task.name"></v-list-tile-title>
                                    <v-btn
                                            flat
                                            @click="completedTask(task)"
                                    >
                                        <v-icon>mdi-check-circle</v-icon>
                                        </v-btn>
                                    <v-btn
                                            flat
                                            @click="failedTask(task)"
                                    >
                                        <v-icon>mdi-window-close</v-icon>
                                    </v-btn>
                                    <v-btn
                                            flat
                                            @click="deleteTask(task)"
                                    >
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </v-list-tile>
                            </v-list>
                            <v-btn
                                dark
                                @click="dialogTask=true"
                            >
                                Add new task
                            </v-btn>
                        </v-card>
                    </v-flex>
                </v-layout>
                </div>
                <div v-if="flagTeammates">
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-card>
                                <v-toolbar color="indigo" dark>
                                    <v-toolbar-side-icon></v-toolbar-side-icon>
                                    <v-toolbar-title>Teammates</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                </v-toolbar>
                                <v-list>
                                    <v-list-tile
                                            v-for="user in currentTeam.teammates"
                                            avatar
                                            @click=""
                                    >
                                        <v-list-tile-content>
                                            <v-list-tile-title v-text="user.username"></v-list-tile-title>
                                        </v-list-tile-content>
                                        <v-list-tile-avatar>
                                            <img :src="user.profile_picture">
                                        </v-list-tile-avatar>
                                    </v-list-tile>
                                </v-list>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </div>
                <div v-if="flagInformation">
                    <span>Completed tasks:{{currentTeam.countCompleted}}</span> <hr>
                    <span>Failed tasks:{{currentTeam.countFailed}}</span>
                    <span>Creator:{{currentTeam.creator.nickname}}</span>
                </div>
                <div v-if="flagHistory">
                </div>
            </v-flex>
        </v-dialog>
</v-container>
</template>
<script>
  import  firebase from 'firebase'
  export default {
    data() {
      return {
        currentUid:null,
        tasks:[],
        pickerTime:null,
        flagTasks :true,
        flagTeammates:false,
        flagInformation:false,
        nameOfTask:null,
        picker: new Date().toISOString().substr(0, 10),
        currentTeam : null,
        dialogTask:false,
        dialogTeam:false,
        flagHistory:false,
        teams: [
        ]
      }
    },
    methods : {
        addTask : function() {
          let Teams
          let that = this;
          let task_info = {
            name: this.nameOfTask,
            date: this.picker,
            time: this.pickerTime,
            team: this.currentTeam.name
          }
          let teamName = this.currentTeam.name
          firebase.database().ref('users/' + that.currentUid + '/teams' + '/team').once('value', function(snapshot) {
            Teams = snapshot.val();
            for (let n = 0; n < Teams.length; n++) {
              if (teamName == Teams[n].name) {
                if (Teams[n].tasks != undefined) {
                  Teams[n].tasks.push(task_info);
                } else {
                  Teams[n].tasks = [task_info,]
                }
              that.tasks = Teams[n].tasks
                break;
              }
            }
            firebase.database().ref('users/' + that.currentUid+ '/teams').set({
              team: Teams
            })
          })
        },
      showMenu:function(team) {
        this.currentTeam = team
        this.currentUid = team.creator.uid
        this.dialogTeam = true
        let that = this
        firebase.database().ref('users/'+team.creator.uid).child('teams').child('team').orderByChild('name').equalTo(team.name).once('value',function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            that.tasks = childSnapshot.val().tasks;
          });
        })
      },
      completedTask:function(task) {
          let teams
        let that = this
        console.log(this.currentTeam.creator.uid)
        console.log(task.name)
        firebase.database().ref('users/'+this.currentUid+'/teams/team').on('value',function(snapshot) {
          teams=snapshot.val()
          for(let i=0;i<teams.length;i++){
            if(teams[i].name == task.team){
                for(let j=0;j<teams[i].tasks.length;j++){
                  console.log(task.name)
                  console.log(teams[i].tasks[j].name)
                  if(task.name == teams[i].tasks[j].name){
                    teams[i].tasks.splice(j,1)

                   console.log(teams)
                    firebase.database().ref('users/'+that.currentUid+'/teams').set({
                      team: teams
                    })
                  }
                }
            }
          }
        console.log(teams)
        })
      },
      failedTask:function(task) {
        let teams
        let that = this
        console.log(this.currentTeam.creator.uid)
        console.log(task.name)
        firebase.database().ref('users/'+this.currentUid+'/teams/team').on('value',function(snapshot) {
          teams=snapshot.val()
          for(let i=0;i<teams.length;i++){
            if(teams[i].name == task.team){
              for(let j=0;j<teams[i].tasks.length;j++){
                console.log(task.name)
                console.log(teams[i].tasks[j].name)
                if(task.name == teams[i].tasks[j].name){
                  teams[i].tasks.splice(j,1)

                  console.log(teams)
                  firebase.database().ref('users/'+that.currentUid+'/teams').set({
                    team: teams
                  })
                }
              }
            }
          }
          console.log(teams)
        })
      },
      deleteTask:function(task) {
        let teams
        let that = this
        console.log(this.currentTeam.creator.uid)
        console.log(task.name)
        firebase.database().ref('users/'+this.currentUid+'/teams/team').on('value',function(snapshot) {
          teams=snapshot.val()
          for(let i=0;i<teams.length;i++){
            if(teams[i].name == task.team){
              for(let j=0;j<teams[i].tasks.length;j++){
                console.log(task.name)
                console.log(teams[i].tasks[j].name)
                if(task.name == teams[i].tasks[j].name){
                  teams[i].tasks.splice(j,1)

                  console.log(teams)
                  firebase.database().ref('users/'+that.currentUid+'/teams').set({
                    team: teams
                  })
                }
              }
            }
          }
          console.log(teams)
        })
          },


      showTasks : function() {
        this.flagTasks=true
        this.flagInformation = false
        this.flagTeammates = false
        this.flagHistory = false
      },
      showTeammeates : function() {
        this.flagTasks=false
        this.flagInformation = false
        this.flagTeammates = true
        this.flagHistory = false
      },
      showInformation : function() {
        this.flagTasks=false
        this.flagInformation = true
        this.flagTeammates = false
        this.flagHistory = false
      },
      showHistory:function(){
        this.flagTasks = false
        this.flagInformation = false
        this.flagHistory=true
        this.flagTeammates = false
      },
      Favourite:function(task){
       task.main.main =  !task.main.main
        console.log(task);
        for(let i=0;i<this.teams.length;i++){
           if(this.teams[i].tasks!=undefined){
          for(let j=0;j<this.teams[i].tasks.length;j++){
            console.log(task.name);
            console.log(this.teams[i].tasks[j].name)
            if(task.name == this.teams[i].tasks[j].name){
              var indexTeam = i;
              var indexTask = j;
              break;
            }
            }
          }
        }
        console.log(indexTeam , ',',indexTask)
        firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/teams'+'/team').child(indexTeam).child('tasks')
          .child(indexTask).child('main').set({
          main :true
        })
},
      unFavourite : function(task){
        task.main.main = false
         console.log(task);
         for(let i=0;i<this.teams.length;i++){
           if(this.teams[i].tasks!=undefined){
           for(let j=0;j<this.teams[i].tasks.length;j++){
             console.log(task.name);
             console.log(this.teams[i].tasks[j].name)
             if(task.name == this.teams[i].tasks[j].name){
               var indexTeam = i;
               var indexTask = j;
               break;
             }
           }
           }
         }
           console.log(indexTeam , ',',indexTask)
         firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/teams'+'/team').child(indexTeam).child('tasks')
           .child(indexTask).child('main').set({
           main :false
         })
    }
  },
    created(){
      let user = firebase.auth().currentUser
      let that = this;
      firebase.database().ref('users/'+user.uid+'/teams'+'/team').once('value',function(snapshot) {
        let teams_info = snapshot.val()
        that.teams = teams_info;
        console.log(teams_info);
      })
      this.currentTeam = this.teams[0]
    }
  }
</script>
<style scoped>
 </style>
