<template>
    <v-container >
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
                                @click=""
                        >
                            <v-list-tile-content>
                                <v-list-tile-title v-text="team.name.value"></v-list-tile-title>
                                <span>{{team.tasks.length}}</span>
                            </v-list-tile-content>

                            <v-list-tile-avatar>
                                <img :src="team.avatar">
                            </v-list-tile-avatar>
                            <v-btn flat
                                color="dark"
                                @click="showMenu(team)"
                            >
                                Open menu
                            </v-btn>
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

                <v-date-picker v-model="picker" :landscape="landscape" :reactive="reactive"></v-date-picker>
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
                width="800"
        >
            <v-flex full-width>
                <v-toolbar light>
                    <v-spacer></v-spacer>
                    <v-toolbar-items class="hidden-sm-and-down">
                        <v-btn @click="showTasks" flat>Tasks</v-btn>
                        <v-btn @click="showTeammeates"flat>Teammaetes</v-btn>
                        <v-btn @click="showInformation"flat>Information</v-btn>
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
                                        v-for="task in currentTeam.tasks"
                                        :key="task.name"
                                        avatar
                                        @click=""
                                >
                                    <v-list-tile-content>
                                        <v-list-tile-title v-text="task.date"></v-list-tile-title>
                                        <v-list-tile-title v-text="task.name"></v-list-tile-title>
                                        <v-list-tile-title v-if="task.failed">Failed!</v-list-tile-title>
                                        <v-list-title-title
                                                v-if="task.completed"
                                        >Completed!</v-list-title-title>
                                    </v-list-tile-content>
                                    <v-btn
                                            v-if="!(task.failed || task.completed)"
                                            dark
                                            @click="completedTask(task)"
                                    >
                                        Complete
                                        </v-btn>
                                    <v-btn
                                            v-if="!(task.failed || task.completed)"
                                            dark
                                            @click="failedTask(task)"
                                    >
                                        Failed
                                    </v-btn>
                                    <v-btn
                                            dark
                                            @click="deleteTask(task.name)"
                                    >
                                        Delete
                                    </v-btn>
                                </v-list-tile>
                            </v-list>
                            <v-btn
                                dark
                                @click="test"
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
                                            :key="user.username"
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
            </v-flex>
        </v-dialog>
</v-container>
</template>

<script>
  import  firebase from 'firebase'
  export default {
    data() {
      return {
        flagTasks :true,
        flagTeammates:false,
        flagInformation:false,
        nameOfTask:null,
        picker: new Date().toISOString().substr(0, 10),
        landscape: true,
        reactive: true,
        currentTeam : null,
        dialogTask:false,
        dialogTeam:false,
        teams: [

        ]
      }
    },
    methods : {
        test : function() {
          this.dialogTask = true;
        },
        addTask : function(team) {
          for(let i=0;i<this.teams.length;i++){
            if(this.teams[i]==this.currentTeam){
              console.log(this.teams)
              this.teams[i].tasks.push({
                name:this.nameOfTask,
                date:this.picker,
                completed:false,
                failed:false
              })
              this.dialogTask = false;
              console.log(this.currentTeam)
              console.log(this.currentTeam.teammates.length)
              for(let i=0;i<this.currentTeam.teammates.length;i++){
                let id = this.currentTeam.teammates[i].uid
                firebase.database().ref('users/'+id+'/teams').set({
                  team : this.teams
                })
              }
            }
          }
        },
      showMenu:function(team) {
        console.log(team)
        this.currentTeam = team;
        console.log(this.currentTeam)
        this.dialogTeam = true;

      },
      completedTask:function(task) {
        task.completed=true
        for(let i=0;i<this.currentTeam.teammates.length;i++){
          let id = this.currentTeam.teammates[i].uid
          firebase.database().ref('users/'+id+'/teams').set({
            team : this.teams
          })
        }
      },
      failedTask:function(task) {
        task.failed=true
        for(let i=0;i<this.currentTeam.teammates.length;i++){
          let id = this.currentTeam.teammates[i].uid
          firebase.database().ref('users/'+id+'/teams').set({
            team : this.teams
          })
        }
      },
      deleteTask:function(name) {
        for(let i=0;i<this.currentTeam.tasks.length;i++){
          if(name==this.currentTeam.tasks[i].name){
            this.currentTeam.tasks.splice(i,1)
          }
        }
        for(let i=0;i<this.currentTeam.teammates.length;i++){
          let id = this.currentTeam.teammates[i].uid
          firebase.database().ref('users/'+id+'/teams').set({
            team : this.teams
          })
        }
      },
      showTasks : function() {
        this.flagTasks=true
        this.flagInformation = false
        this.flagTeammates = false
      },
      showTeammeates : function() {
        this.flagTasks=false
        this.flagInformation = false
        this.flagTeammates = true
      },
      showInformation : function() {
        this.flagTasks=false
        this.flagInformation = true
        this.flagTeammates = false
      }
    },
    created(){
      let user = firebase.auth().currentUser
      let that = this;
      firebase.database().ref('users/'+user.uid+'/teams'+'/team').once('value',function(snapshot) {
        let teams_info = snapshot.val()
        that.teams = teams_info;
      })
      this.currentTeam = this.teams[0]
    }
  }
</script>
<style scoped>
    li{
        list-style-type : none;
    }
 </style>
