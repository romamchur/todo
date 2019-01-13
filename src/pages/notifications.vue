<template>
<div id="content">
<v-layout full-width>
  <v-flex full width>
    <v-card full-width>
      <v-list full-width>
        <v-list-tile
          v-for="notification in notifications"
          avatar
          @click="openDialog(notification)"
        >
          <v-list-tile-content>
            <v-list-tile-title v-text="notification.author_name"></v-list-tile-title>
            <span>{{notification.text}}</span>
          </v-list-tile-content>
          <v-list-tile-avatar>
            <img :src="notification.author_avatar">
          </v-list-tile-avatar>
        </v-list-tile>
      </v-list>
    </v-card>
  </v-flex>
</v-layout>
<v-dialog
    v-model="dialog"
    max-width="290"
  >
    <v-card>
      <v-card-title class="headline">Прийняти це запрошення ?</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="green darken-1"
          flat="flat"
          @click="Cancel"
        >
          Відмінити
        </v-btn>

        <v-btn
          color="green darken-1"
          flat="flat"
          @click="Accept"
        >
        Прийняти
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-layout>
</div>
</template>
<script>
  import firebase from 'firebase'
  export  default {
    data(){
      return{
        notifications : [] ,
        dialog:false,
        currentNotification:null,
        username : null

      }
    },
    methods:{
      openDialog:function(notification){
        this.dialog = true
        this.currentNotification = notification
      },
      Cancel : function() {
        let that = this
        let notifications
          this.dialog = false
          firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/chats'+'/notifications').once('value',function(snapshot){
            notifications = snapshot.val()
            for(let i=0;i<notifications.length;i++){
              console.log(that.currentNotification)
              console.log(notifications[i])
              if(that.currentNotification.author_name == notifications[i].author_name  && that.currentNotification.author_avatar == notifications[i].author_avatar && that.currentNotification.text == notifications[i].text){
                console.log('working')
                notifications.splice(i,1)
                break
              }
            }
              that.notifications = notifications
            firebase.database().ref('users/'+firebase.auth().currentUser.uid + '/chats').set({
                notifications : notifications
            }
          )
          })
      },
      Accept : function() {
        let currentUserName
        let currentUserAvatar
        firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',function(snapshot){
          currentUserName = snapshot.val().username
          currentUserAvatar = snapshot.val().profile_picture.value
        })
      let uidArray = [firebase.auth().currentUser.uid]
      let author_name = this.currentNotification.author_name
      let author_avatar = this.currentNotification.author_avatar
      let chats
      let that = this
      firebase.database().ref().child('users').orderByChild('username').equalTo(author_name).once(`value`,function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
           uidArray.push(childSnapshot.val().uid)
            that.chat_info = {
               name1:author_name,
               avatar1:author_avatar,
               name2:currentUserName,
               avatar2:currentUserAvatar,
               usersUid:uidArray,
               msg:[{
                 author_name : 'Admin',
                 author_avatar : 'https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjFmsWNitTfAhVkMewKHRm1C70QjRx6BAgBEAU&url=http%3A%2F%2Felderscrolls.wikia.com%2Fwiki%2FHermaeus_Mora&psig=AOvVaw2QMfmBl4WjBNB4WKDeFGqU&ust=1546689652048034',
                 text : 'Hello , its your private chat'
               }]
             }
        });
          console.log(uidArray)
          for(let n=0;n<uidArray.length;n++){
            let uid = uidArray[n]
            console.log(uid)
            firebase.database().ref('users/'+uid+'/chats').once('value',function(snapshot){
              chats=snapshot.val()
              console.log('FirstChat:',chats)
              if(chats == undefined){
                chats = {}
              }
              if(chats.chats == undefined){
                chats.chats = []
              }
              chats.chats.push(that.chat_info)
              console.log(chats)
              firebase.database().ref('users/'+uid+'/chats').set({
                chats : chats.chats
              })
            })
          }
      })

      }
    },
    created(){
      let that = this
      firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/chats'+'/notifications').once('value',function(snapshot){
        that.notifications = snapshot.val()
      })
      console.log(that.notifications)
      console.log('working created')
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
