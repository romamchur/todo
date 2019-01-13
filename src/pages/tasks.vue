<template>
    <div id="content">
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
                                avatar
                                @click=""
                        >
                            <v-list-tile-content>
                                <v-list-tile-title v-text="team.name.value"></v-list-tile-title>
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
                        <v-btn @click="showChat"flat>History</v-btn>
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

                                        avatar
                                        @click=""
                                >
                                    <v-icon id="Spans" v-if="!task.main.main" @click="Favourite(task)">mdi-star-outline</v-icon>
                                    <v-icon id="Spans" v-if="task.main.main" @click="unFavourite(task)">mdi-star</v-icon>
                                    <v-icon>mdi-calendar-range</v-icon>
                                    <span id="Spans">{{task.date}}</span>

                                        <v-list-tile-title v-text="task.name"></v-list-tile-title>

                                    <v-btn
                                            flat
                                            v-if="!(task.failed.value || task.completed.value)"
                                            @click="completedTask(task)"
                                    >
                                        <v-icon>mdi-check-circle</v-icon>
                                        </v-btn>
                                    <v-btn
                                            v-if="!(task.failed.value || task.completed.value)"
                                            flat
                                            @click="failedTask(task)"
                                    >
                                        <v-icon>mdi-window-close</v-icon>
                                    </v-btn>
                                    <v-btn
                                            v-if="check"
                                            flat
                                            @click="deleteTask(task.name)"
                                    >
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </v-list-tile>
                            </v-list>
                            <v-btn
                                dark
                                @click="test"
                                v-if="check"
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
    </div>
</template>

<script>
  import  firebase from 'firebase'
  export default {
    data() {
      return {
        text_msg : null,
        check : false,
        pickerTime:null,
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
        flagChat:false,
        flagHistory:false,
        teams: [
        ]
      }
    },
    methods : {
        sendMsg : function(){
          let uidArray = []
          for(let i = 0 ; i<this.currentTeam.teammates.length;i++){
            uidArray[i] = this.currentTeam.teammates[i].uid
          }
          console.log(uidArray);
          var author_info
          firebase.database().ref('users/'+firebase.auth().currentUser.uid).on('value',function(snapshot){
            author_info = {
              author:snapshot.val().username,
              avatar:snapshot.val().profile_picture
            }
          })
          var msg_info = {
            author:author_info.author,
            avatar:author_info.avatar,
            text:this.text_msg
          }
          var Teams
          var that = this
           for(let j=0;j<uidArray.length;j++){
             let id = uidArray[j]
             console.log(j,'-результат')
             firebase.database().ref('users/' + id + '/teams' + '/team').once('value', function(snapshot) {
               console.log('snapshot:', snapshot.val())
               Teams = snapshot.val();
               console.log(Teams);
               for (let n = 0; n < Teams.length; n++) {
                 if (that.currentTeam.name.value == Teams[n].name.value) {
                   console.log(that.currentTeam.name.value)
                   console.log(Teams[n].name.value)
                   console.log('chat:',Teams[n].chat)
                   Teams[n].chat.push(msg_info);
                   break;
                 }
               }
               console.log(Teams)
               firebase.database().ref('users/' + id + '/teams').set({
                 team: Teams
               })
             })
           }
           this.text_msg = '';
        },
        test : function() {
          this.dialogTask = true;
          console.log(this.teams.length)
        },
        addTask : function() {
          for(let i=0;i<this.currentTeam.teammates.length;i++){
            let uidForHistory = this.currentTeam.teammates[i].uid
            let history_info={
              Author : "Admin",
              Name: 'Test',
              Information : 'Was completed'
            }
            console.log(uidForHistory)
            console.log(history_info)
          }
          console.log('Current team:', this.currentTeam)
          var Teams;
          var that = this;
          var task_info = {
            name: that.nameOfTask,
            date: that.picker,
            time: that.pickerTime,
            completed:{ value:false},
            failed: {value:false},
            main: { main: false },
            team: that.currentTeam.name
          }
          console.log('this.teammates:',this.currentTeam.teammates)
          if(this.currentTeam.tasks != undefined) {
            this.currentTeam.tasks.push(task_info)
          }
          else{
            this.currentTeam.tasks = [task_info,]
          }
          for(let i=0;i<that.currentTeam.teammates.length;i++) {
            console.log(i,'-результат:')
            var id = that.currentTeam.teammates[i].uid;
            console.log(id);
            firebase.database().ref('users/' + id + '/teams' + '/team').once('value', function(snapshot) {
              console.log('snapshot:', snapshot.val())
              Teams = snapshot.val();
              console.log(Teams);
              for (let n = 0; n < Teams.length; n++) {
                if (that.currentTeam.name.value == Teams[n].name.value) {
                  console.log(that.currentTeam.name.value)
                  console.log(Teams[n].name.value)
                  console.log('tasks:',Teams[n].tasks)
                  if(Teams[n].tasks!=undefined) {
                    Teams[n].tasks.push(task_info);
                  }
                  else{
                    console.log('work')
                    Teams[n].tasks = [task_info,]
                  }
                  break;
                }
              }
              console.log(Teams)
              firebase.database().ref('users/' + id + '/teams').set({
                team: Teams
              })
            })
            this.dialogTask = false
                      }
        },
      showMenu:function(team) {
        console.log(team)
        let that = this
        this.currentTeam = team;
        let teamName = this.currentTeam.name.value
        let creatorTasks
        let teamIndex
        let   oldTeams = that.teams
        firebase.database().ref('users/'+this.currentTeam.creator.uid+'/teams'+'/team').once('value',function(snapshot){
          console.log(snapshot.val())
          for(let i=0;i<snapshot.val().length;i++){
            if(snapshot.val()[i].name.value == teamName){
              creatorTasks = snapshot.val()[i].tasks

              console.log(creatorTasks)
              that.currentTeam.tasks = creatorTasks
              for(let g=0;g<that.teams.length;g++){
                  if(that.teams[g].name.value == teamName){
                      teamIndex = g
                      console.log(teamIndex)
                      that.teams[g].tasks = creatorTasks
                      console.log('old:',oldTeams)
                      for(let x=0;x<oldTeams.length;x++){

                          that.teams[g].tasks[x].main.main = oldTeams[g].tasks[x].main.main
                      }
                      firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/teams').set({
                        team: that.teams
                      })
                  }
              }
            }
          }
        })

        console.log(this.currentTeam)
        this.dialogTeam = true;
        console.log(firebase.auth().currentUser.uid)
        if(firebase.auth().currentUser.uid == this.currentTeam.creator.uid){
          this.check = true;
        }
        else{
          this.check = false
        }
      },
      completedTask:function(task) {
        for(let i=0;i<this.currentTeam.teammates.lenght;i++){
          let uidForHistory = this.currentTeam.teammates[i].uid
          let history_info={
            Author : "Admin",
            Name: task.name,
            Information : 'Was completed'
          }
        }
        task.completed.value=true
        let taskIndex
        let that = this
        let tempTeams
        for(let u=0;u<this.currentTeam.tasks.length;u++){
          if(this.currentTeam.tasks[u].name == task.name){
            taskIndex = u
          }
        }
      for(let i=0;i<this.currentTeam.teammates.length;i++){
        let teamIndex
          let id = this.currentTeam.teammates[i].uid
          console.log(id)
        firebase.database().ref('users/'+id+'/teams'+'/team').on('value',function(snapshot){
          tempTeams = snapshot.val()
          for(let h=0;h<snapshot.val().length;h++){
            if(snapshot.val()[h].name.value == that.currentTeam.name.value){
              console.log('work')
                tempTeams[h].tasks.splice(taskIndex,1)
                console.log(tempTeams)
              break;
            }
          }
        })

        firebase.database().ref('users/'+id+'/teams').set({
            team : tempTeams
        })
      }
        that.currentTeam.tasks.splice(taskIndex,1)
      },
      failedTask:function(task) {

        let taskIndex
        let that = this
        let tempTeams
        for(let u=0;u<this.currentTeam.tasks.length;u++){
          if(this.currentTeam.tasks[u].name == task.name){
            taskIndex = u
          }
        }

      for(let i=0;i<this.currentTeam.teammates.length;i++){
        let teamIndex
          let id = this.currentTeam.teammates[i].uid
          console.log(id)
        firebase.database().ref('users/'+id+'/teams'+'/team').on('value',function(snapshot){
          tempTeams = snapshot.val()
          for(let h=0;h<snapshot.val().length;h++){

            if(snapshot.val()[h].name.value == that.currentTeam.name.value){
              console.log('work')
                tempTeams[h].tasks.splice(taskIndex,1)
                console.log(tempTeams)
              break;
            }
          }
        })

        firebase.database().ref('users/'+id+'/teams').set({
            team : tempTeams
        })
      }
      that.currentTeam.tasks.splice(taskIndex,1)
      },
      deleteTask:function(name) {
        var tempTeams
        var uidArray = [];
        for(let n=0;n<this.currentTeam.teammates.length;n++){
          uidArray[n] = this.currentTeam.teammates[n].uid
        }
        for(let n=0;n<uidArray.length;n++) {
          let id = uidArray[n];
          firebase.database().ref('users/' + id + '/teams' + '/team').once('value', function(snapshot) {
            tempTeams = snapshot.val()
          })
          console.log(tempTeams)
          for (let i = 0; i < tempTeams.length; i++) {
            if (tempTeams[i].tasks!=undefined) {
            for (let j = 0; j < tempTeams[i].tasks.length; j++) {
                if (name == tempTeams[i].tasks[j].name) {
                  console.log('work');
                  var indexTeam = i;
                  var indexTask = j;
                  break;
                }
              }
            }
          }
          tempTeams[indexTeam].tasks.splice(indexTask, 1);
          for (let i = 0; i < this.currentTeam.tasks.length; i++) {
            if (name == this.currentTeam.tasks[i].name  ) {
              this.currentTeam.tasks.splice(i, 1)
            }
          }
          console.log(n , 'ий результат:');
          console.log(tempTeams);
         console.log('ID:',id)
            firebase.database().ref('users/' + id + '/teams').set({
              team: tempTeams
            })
          }
        this.dialogTeam = false
        this.dialogTeam = true
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
      showChat:function(){
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
    li{
        list-style-type : none;
    }
    #Spans{
        margin-right:20px;
    }
    #content{
        position:absolute;
        left:10%;
        top:10%;
        width:90;
    }
    .spanAuthor{
        color:green;
      }

 </style>
