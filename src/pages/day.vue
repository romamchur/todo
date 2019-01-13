<template>
    <div class="background">
        <v-layout  row full-width>
            <v-flex full-width>
                <v-card full-width>
                    <v-toolbar color="dark" dark >
                        <v-toolbar-title>Day Tasks</v-toolbar-title>
                    </v-toolbar>
                    <v-list light full-width>
                        <v-list-tile
                                v-for="task in tasks"
                                @click=""
                        >
                            <v-list-tile-content full-width>
                                <v-list-tile-title full-width>
                                    <v-icon v-if="task.main.main">mdi-star</v-icon>
                                    <v-icon v-if="!task.main.main">mdi-star-outline</v-icon>
                                    <span id="name">{{task.name}}</span>
                                    <v-icon id="teamIcon">mdi-account-group</v-icon>
                                    <span id="team">{{task.team.value}}</span>
                                    <v-icon id="CalendarIcon">mdi-calendar-range</v-icon>
                                    <span id="Date">{{task.date}}</span>
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
  import firebase from  'firebase'

  export  default {
    data(){
      return{
        tasks:[]
      }
    },
    created(){
      this.tasks = [];
      let id=firebase.auth().currentUser.uid;
      var tempTeams;
      firebase.database().ref('users/'+id+'/teams'+'/team').once('value',function(snapshot) {
        tempTeams = snapshot.val();
      })
      console.log('tempTeams:',tempTeams)
      for(let i=0;i<tempTeams.length;i++){
        console.log(tempTeams[i].tasks.length)
        if(tempTeams[i].tasks.length == undefined){
          tempTeams.splice(i,1);
        }
      }
      console.log('tempTeams:',tempTeams)
      for(let i=0;i<tempTeams.length;i++){
        for(let j=0;j<tempTeams[i].tasks.length;j++){
          let date = new Date(tempTeams[i].tasks[j].date+'T'+tempTeams[i].tasks[j].time+':00Z');
          if(date.getTime()-new Date().getTime() < 86400000){
            this.tasks.push(tempTeams[i].tasks[j])
          }
        }
      }
    }
  }
</script>

<style scoped>
    .background{
        position:absolute;
        top:10%;
        left:10%;
        width:88%;
    }
    #name{
        position: absolute;
        left:10%;
    }
    #teamIcon{
        position:absolute;
        left:35%;
    }
    #team{
        position:absolute;
        left:39%
    }
    #CalendarIcon{
        position: absolute;
        left:80%
    }
    #Date{
        position: absolute;
        left:85%;
    }
</style>