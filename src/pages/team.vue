<template>
    <v-flex full-width>
  
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
            console.log(snapshot.val())
            snapshot.forEach(function(childSnapshot) {
              var childData = childSnapshot.val();
             var  teammate_info = {
                profile_picture : childData.profile_picture.value,
                username : childData.username,
                uid : childData.uid
              }
              that.teammates.push(teammate_info);
             console.log(that.teammates)
            });
          })
        },

        createNewTeam: function() {
          firebase.database().ref('users/'+  firebase.auth().currentUser.uid).on('value',(snapshot)=>{
        creatorName = snapshot.val().username;
        creatorAvatar = snapshot.val().profile_picture
          })
          let team_info = {
            chat:[{
              author:'Admin',
              text:"Hello , it's your chat ",
              avatar : "https://wi-images.condecdn.net/image/6DoWNVJlrWM/crop/2040/f/black-hole.jpg"
            }],
            name : {value:this.name},
            tasks: [{

              main:{
                main:false
              },
              countCompleted:0,
              countFailed:0,
              name:'Created team',
              failed:{value:false},
              completed:{value:true}
            }],

            creator : {
              uid: firebase.auth().currentUser.uid,
              nickname: creatorName,
              avatar: creatorAvatar
            },
            teammates : this.teammates,
            avatar : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNdpha9EZVejEMLRm19usL5_JyKJy73a8n14cxWtk0BctxI37Y'
          }
          console.log(this.teammates)
          console.log('team_info:',team_info)
          var that = this
          console.log(team_info.teammates.length)
          var uidArray = [];
          for(let n=0;n<team_info.teammates.length;n++){
            uidArray[n]=team_info.teammates[n].uid
          }
          console.log('uidArray:',uidArray)
          var Teams = [];
          for(let i=0;i<uidArray.length;i++) {
            let id = uidArray[i];
            console.log(i,':',uidArray[i]);
            firebase.database().ref('users/'+id+'/teams'+'/team').once('value',function(snapshot) {
              console.log('snapshot:',snapshot.val())
              Teams=snapshot.val();
              console.log(Teams);
              Teams.push(team_info);
              console.log(Teams)
              firebase.database().ref('users/'+id+'/teams').set({
                team:Teams
              })
            })
          }
          this.name = '';
          this.nickname='';

        }
    },
    created () {
      this.teammates = [];
      let user = firebase.auth().currentUser;
      var that = this;
      firebase.database().ref('users/'+user.uid).once('value',function(snapshot) {
        var user_info = {
          username : snapshot.val().username,
          profile_picture : snapshot.val().profile_picture.value,
          uid : firebase.auth().currentUser.uid,
        }
        that.teammates.push(user_info)
    })
    }
  }
</script>
