<template>
<div id="content">
<div>
<v-layout row>
    <v-flex full-width>
        <v-card>
            <v-list two-line>
                <template v-for="chat in chats">
                    <v-subheader
                    >
                       <span v-if="chat.name1!=currentUserName"> <strong> {{ chat.name1 }} </strong> </span>
                       <span v-if="chat.name2!=currentUserName"> <strong> {{ chat.name2}} </strong> </span>
                    </v-subheader>

                    <v-divider
                    >
                        {{ chat.name }}
                    </v-divider>

                    <v-list-tile
                            avatar
                            @click="openChatDialog(chat)"
                    >
                        <v-list-tile-avatar>
                            <img :src="chat.avatar1">
                        </v-list-tile-avatar>
                        <v-list-tile-avatar

                        >
                            <img :src="chat.avatar2">
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title v-html="chat.msg[chat.msg.length-1].text"></v-list-tile-title>
                            <v-list-tile-sub-title v-html="chat.msg[chat.msg.length-1].author_name"></v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
            </v-list>
        </v-card>
    </v-flex>
 </v-layout>
    <v-btn
      block
      round
      color="blue"
      @click = "dialog=true"
    >
      Start new chat
    </v-btn>

  <v-dialog
        v-model="dialog"
        width="500"
      >
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            Enter user nickname
          </v-card-title>
          <v-divider></v-divider>
          <v-card-actions>
          <v-text-field
            solo
            v-model="username"
            placeholder="Friend's nickname"
          >
          </v-text-field>
            <v-spacer></v-spacer>
            <v-btn
              color="success"
              flat
              @click="Accepting"
            >
               Accept
            </v-btn>
            <v-btn
              color="error"
              flat
              @click="dialog = false"
            >
               Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
            v-model="AcceptingFlag"
            width="500"
          >
            <v-card>
              <v-card-title
                class="headline grey lighten-2"
                primary-title
              >
                This user?
              </v-card-title>
              <v-divider></v-divider>
              <v-card-actions>
              <v-img
         class="elevation-6"
       ></v-img>
     </v-list-tile-avatar v-if="false">
          {{user_info.username}}
     <v-list-tile-content>
       <v-list-tile-title></v-list-tile-title>
     </v-list-tile-content>
                <v-spacer></v-spacer>
                <v-btn
                  color="success"
                  flat
                  @click="Inviting"
                >
                   Yes
                </v-btn>
                <v-btn
                  color="error"
                  flat
                  @click="AcceptingFlag = false"
                >
                   No
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
          <v-layout row justify-center>
       <v-dialog v-model="dialogChat" width="600px">
       <v-card full-widht>
         <v-card-title>
           <span class="headline">{{title}}</span>
         </v-card-title>
         <v-card-text>
           <v-list-tile
                                             v-for="msg in this.messages"
                                             avatar

                                     >
                                         <v-list-tile-avatar>
                                             <img :src="msg.author_avatar">
                                         </v-list-tile-avatar>
                                         <span class="spanAuthor">{{msg.author_name}} :   </span>
                                         <v-list-tile-content>
                                             <v-list-tile-title v-text="msg.text"></v-list-tile-title>
                                         </v-list-tile-content>
                                     </v-list-tile>
         </v-card-text>
          <v-text-field
          id="msgForm"
             solo
             fixed
             full-width
             v-model = "message_text"
             placeholder="Message"
          >
          </v-text-field>
          <v-spacer></v-spacer>
          <v-btn
             light
             left
             @click = "sendMsg"
             @keyup.enter="sendMsg"
           >
             Send
           </v-btn>
       </v-card>
       </v-dialog>
     </v-layout>
    </div>
</template>
<script>
import firebase from 'firebase'
  export default {
    data () {
      return {
        message_text:null,
        uidArray:[],
        title: null,
        messages: null ,
        dialogChat:false ,
        dialog: false,
        username : null,
        user_info : {username: 'Standart',
        profile_picture:  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbU62a0ZbEa7UgZ054vrXmUbRwd77RRQPouSVP-qlM6g96GhOE'},
        AcceptingFlag : false,
        chats : [],
        currentUserName:'standart' ,
      }
    },
    methods :{
      Accepting: function(){
        var that = this


        firebase.database().ref().child('users').orderByChild('username').equalTo(this.username).once(`value`,function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();

              that.AcceptingFlag = true
             that.user_info = {
              profile_picture : childData.profile_picture,
              username : childData.username,
            }

          });
        })
        this.username = null
      },
      Inviting : function(){
        var author_info
        var notification_info
        firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',function(snapshot){
          author_info = {
            username : snapshot.val().username,
            profile_picture : snapshot.val().profile_picture
          }
        })
        var that = this
      {
        firebase.database().ref().child('users').orderByChild('username').equalTo(this.user_info.username).once(`value`,function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var uidUser = childSnapshot.val().uid
            firebase.database().ref('users/'+uidUser).once('value',function(Information){
              console.log('Information.val()')
                console.log(Information.val())
                var Information = Information.val()
                if(Information.chats == undefined){
                  Information.chats = []
                }
                console.log(Information)
                console.log(Information.chats.notifications)
                console.log('Information:',Information)
                if(Information.chats.notifications == undefined){
                  Information.chats.notifications = []
                }
                if(Information.chats.chats == undefined){
                  Information.chats.chats = []
                }
                notification_info ={
                  author_name : author_info.username,
                  author_avatar : author_info.profile_picture.value,
                  text : 'Давай спілкуватись!'
                }
                Information.chats.notifications.push(notification_info)
                firebase.database().ref('users/'+uidUser+'/chats').set({
                  notifications : Information.chats.notifications,
                  chats:Information.chats.chats
                })
            })
          });
        })
      }
    },
      openChatDialog : function(chat){
        var newMessages
        this.dialogChat = true
        this.title = chat.name1 + ' and ' + chat.name2

        this.messages = chat.msg
        this.uidArray = chat.usersUid
                var uidArray = this.uidArray
        console.log(this.uidArray)
        console.log(this.messages)
      },
      sendMsg : function(){
        let author_info
        let tempChats
        let msg_info
        let that = this
        firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',function(snapshot){
          author_info = {
            username : snapshot.val().username,
            avatar : snapshot.val().profile_picture.value
          }
          msg_info = {
            author_name:author_info.username,
            author_avatar:author_info.avatar,
            text:that.message_text
          }
          for(let i=0;i<that.uidArray.length;i++){
          firebase.database().ref('users/'+that.uidArray[i]+'/chats'+'/chats').once('value',function(snapshot){
              tempChats = snapshot.val()
              console.log(tempChats)
              for(let j=0;j<tempChats.length;j++){
                if(tempChats[j].usersUid[0] == that.uidArray[0] &&  tempChats[j].usersUid[1] == that.uidArray[1] ){
                  tempChats[j].msg.push(msg_info)
                }
              }
              firebase.database().ref('users/'+that.uidArray[i]+'/chats').set({
                chats:tempChats
              })
          })
        }

        })

      }
    },
    created(){
      let that = this
      let chat_info
      var length
      firebase.database().ref('users/'+firebase.auth().currentUser.uid).on('value',function(snapshot){
        that.currentUserName = snapshot.val().username
      })
      that.chats = []
      firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/chats'+'/chats').on('value',function(snapshot){
        length = snapshot.val().length
      for(let i=0;i<snapshot.val().length;i++){
        chat_info = snapshot.val()[i]
        that.chats.push(chat_info)
      }
      console.log('that.chats.length:',that.chats.length )
        console.log('length:',length )
        let before = that.chats
        console.log('Before:',before)
      if(that.chats.length - length>0){
        that.chats.splice(0,that.chats.length/2)
      }
      for(let n=0;n<length;n++){
        console.log(that.title)
        console.log(that.chats[n].name1 + ' and ' + that.chats[n].name2)
        if(that.chats[n].name1 + ' and ' + that.chats[n].name2 == that.title ){
          console.log('title:',that.title)
          console.log('name:',that.chats[n].name1 + ' and ' + that.chats[n].name2)
          that.messages = that.chats[n].msg
          console.log(that.chats)
        }
      }
      })
    /*  function updateDataBase(){

        let that = this
        let end_position
        let start_position
        let title = this.title
          firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/chats'+'/chats').on('value',function(snapshot){
            that.chats = snapshot.val()
          })

      }
      setInterval(updateDataBase, 3 * 1000)*/

    }
  }
</script>
<style scoped>
  #content{
    position:absolute;
    top:0;
    left:0;
    width:100%;
  }
</style>
