<template>
    <v-flex full-width>
        <template>
            <v-toolbar>
                <v-spacer></v-spacer>
                <v-toolbar-items class="hidden-sm-and-down">
                    <v-btn :to="'/myTeams'" flat>My teams</v-btn>
                    <v-btn flat>Create new team</v-btn>
                </v-toolbar-items>
            </v-toolbar>
        </template>
    <v-form ref="form" class="nickname_q" lazy-validation>
        <v-text-field
                v-model="nickname"
                solo
                label="Nickname"
                required
        ></v-text-field>
        <v-btn
                @click="addUser"
        >
           Add user by nickname
        </v-btn>
    </v-form>
        <v-layout>
            <v-flex full-width>
                <v-card>
                    <v-list>
                        <v-list-tile
                                v-for="teammate in teammates"
                                :key="teammate.username"
                                avatar
                            >
                            <v-list-tile-content>
                                <v-list-tile-title v-text="teammate.username"></v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-avatar>
                                <img :src="teammate.profile_picture">
                            </v-list-tile-avatar>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>
        <v-flex full-widht>
            <v-text-field
                    v-model="name"
                    v-if = "this.teammates.length>=2"
                    label="Name of your team"
                    solo
            ></v-text-field>
        </v-flex>
        <v-btn
                color="info"
                v-if="this.teammates.length>=2"
                @click.stop="createNewTeam"
        >
            Create new team
        </v-btn>
    </v-flex >
</template>
<script>
  var creatorName;
var creatorAvatar;

    import  firebase from 'firebase'
  export default {
    data () {
      return {
        name : null ,
        nickname : null,
        users : [],
        teammates: [
        ],
        teams : []
      }

      },
    methods:
      {
        addUser : function() {
          var that = this;
          firebase.database().ref().child('users').orderByChild('username').equalTo(this.nickname).once(`value`,function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              var childData = childSnapshot.val();
              that.teammates.push(childData);
            });
          })
        },

        createNewTeam: function() {
          firebase.database().ref('users/'+  firebase.auth().currentUser.uid).on('value',(snapshot)=>{
        creatorName = snapshot.val().username;
           creatorAvatar = snapshot.val().profile_picture
          })
          let team_info = {
            name : {value:this.name},
            tasks: [{
              countCompleted:0,
              countFailed:0,
              name:'Created team',
              failed:false,
              completed:true
            }],
            creator : {
              uid: firebase.auth().currentUser.uid,
              nickname: creatorName,
              avatar: creatorAvatar
            },
            teammates : this.teammates,
            avatar : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNdpha9EZVejEMLRm19usL5_JyKJy73a8n14cxWtk0BctxI37Y'
          }
          var that = this
          for(let i=0;i<team_info.teammates.length;i++) {
            let id =team_info.teammates[i].uid
            firebase.database().ref('users/' + id + '/teams' + '/team').once('value', function(snapshot) {
              that.teams = snapshot.val()
              that.teams.push(team_info);
            })
            firebase.database().ref('users/' + id + '/teams').set({
              team: that.teams
            })
          }
          this.name = '';
          this.nickname='';
          this.teammates.length = 1;
        }
    },
    created () {
      this.teammates = [];
      let user = firebase.auth().currentUser;
      var that = this;
      firebase.database().ref('users/'+user.uid).once('value',function(snapshot) {
        var user_info = {
          username : snapshot.val().username,
          profile_picture : snapshot.val().profile_picture,
          uid : firebase.auth().currentUser.uid,
        }
        that.teammates.push(user_info)
    })
    }
  }
</script>
