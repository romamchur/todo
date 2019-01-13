<template>
    <div id="content">
    <v-layout row>
        <v-flex full-width>
            <v-card>
                <v-list two-line>
                    <template v-for="chat in chats">
                        <v-subheader
                                v-if="chat.team_name"

                        >
                           <span> <strong> {{ chat.team_name }} </strong> </span>
                        </v-subheader>

                        <v-divider
                        >
                            {{ chat.team_name }}
                        </v-divider>

                        <v-list-tile
                                avatar
                                @click="openChatDialog(chat.team_name)"
                        >
                            <v-list-tile-avatar>
                                <img :src="chat.team_avatar">
                            </v-list-tile-avatar>

                            <v-list-tile-content>
                                <v-list-tile-title v-html="chat.lastMsg.text"></v-list-tile-title>
                                <v-list-tile-sub-title v-html="chat.lastMsg.author"></v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                </v-list>
            </v-card>
        </v-flex>
     </v-layout>
      <div >
        <v-layout  >
    <v-dialog v-model="dialog" width="800px">

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
                                            <img :src="msg.avatar">
                                        </v-list-tile-avatar>
                                        <span class="spanAuthor">{{msg.author}} :   </span>
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
          >
            Send
          </v-btn>
      </v-card>
    </v-dialog>
  </v-layout>
  </div>
    </div>
</template>

<script>
  import firebase from 'firebase'
  export  default {
    data(){
      return{
        message_text : null,
        chats : [],
        dialog:false,
        title: null,
        messages : null
      }
    },
    methods : {
      openChatDialog : function(name){
        this.dialog = true;
        this.title = name
        for (let i=0;i<this.chats.length;i++){
          if(name == this.chats[i].team_name){
            this.messages = this.chats[i].messages
            break;
          }
        }
      },
      sendMsg : function(){
        let that = this
        let author
        let msg
        var Teams
        let uidArray = []
        let user = firebase.auth().currentUser.uid
        firebase.database().ref('users/'+user + '/teams'+'/team').once('value',function(snapshot){
            for(let i=1;i<snapshot.val().length;i++){
              if(that.title == snapshot.val()[i].name.value){
                for(let n=0;n<snapshot.val()[i].teammates.length;n++){
                  uidArray.push(snapshot.val()[i].teammates[n].uid)
                }
              }
            }
            firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',function(snapshot){
              author = {
                username : snapshot.val().username,
                avatar : snapshot.val().profile_picture.value
              }
              msg = {
                author : author.username,
                avatar: author.avatar,
                text:that.message_text
              }
            })
             for(let j=0;j<uidArray.length;j++){
               let id = uidArray[j]
               console.log(j,'-результат')
               firebase.database().ref('users/' + id + '/teams' + '/team').once('value', function(snapshot) {
                 console.log('snapshot:', snapshot.val())
                 Teams = snapshot.val();
                 console.log(Teams);
                 for (let n = 0; n < Teams.length; n++) {
                   if (that.title == Teams[n].name.value) {
                     console.log(Teams[n].name.value)
                     console.log('chat:',Teams[n].chat)
                     Teams[n].chat.push(msg);
                     break;
                   }
                 }
                 console.log(Teams)
                 firebase.database().ref('users/' + id + '/teams').set({
                   team: Teams
                 })
               })
             }
        })


      }
    },
    created(){
      let id = firebase.auth().currentUser.uid
      var that = this
      var chat_info ;
      var tempChats = [];
      var length
      that.chats = []
      firebase.database().ref('users/'+id+'/teams'+'/team').on('value',function(snapshot) {
        length = snapshot.val().length
        for(let i=1;i<snapshot.val().length;i++) {
          chat_info = {
            messages: snapshot.val()[i].chat,
            lastMsg: snapshot.val()[i].chat[snapshot.val()[i].chat.length - 1],
            team_name: snapshot.val()[i].name.value,
            team_avatar: snapshot.val()[i].avatar
          }
          tempChats.push(chat_info);
        }
        console.log('tempChats:',tempChats)
        that.chats = tempChats
        console.log('length=',length-1)
        if(that.chats.length != length-1){
          that.chats.splice(0 , that.chats.length/2)
          for(let n=0;n<length-1;n++){
            console.log(that.title)
            console.log(that.chats[n].team_name)
            if(that.chats[n].team_name == that.title ){
              that.messages = that.chats[n].messages
            }
          }
      }
        console.log(that.chats)
      })

  }
  }
</script>

<style scoped>
    #content{
        position:absolute;
        left:0;
        top:0%;
        width:100%;
    }

    .spanAuthor{
      color : red
    }
    #msgForm{
      position: absolute;
      width:640px;
      height: 990px;
    }
</style>
