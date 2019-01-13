<template>
  <div id="content">
    <div>
       <span> <strong> <span class="redSpan">Name :</span> </strong> <span> {{username.value}} </span> </span>
       <v-btn
        small
        flat
        color="red"
       >
        Edit
       </v-btn>
    </div>
    <div>
       <span> <strong> <span class="redSpan">Profile picture :    </span> </strong>  </span>
        <v-avatar size="36px" v-if="flag">
                <img :src="profile_picture.value">
            </v-avatar>
            <v-avatar size="36px" v-if="!flag">
                    <img :src="profile_picture_id">
                </v-avatar>
        <v-btn
        small
        flat
        color="red"
        @click="dialog=true"
       >
        Edit
       </v-btn>
    </div>
   <v-layout row justify-center>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Enter id-link of your new profile picture</v-card-title>
        <v-avatar  id="avatarInDialog" size="210px" >
                <img :src="profile_picture_id">
            </v-avatar>
        <v-text-field
        solo
        v-model="profile_picture_id"
        placeholder="Enter here new id-link"
        >

        </v-text-field>
        <v-btn
          flat
          color="success"
          @click="Accepting"
        >
          Accept
        </v-btn>
        <v-btn
          flat
          color="error"
          @click="dialog=false"
        >
          Cancel
        </v-btn>
        <v-card-actions>
          <v-spacer></v-spacer>
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
        dialog:false,
        username:'Error',
        profile_picture:null,
        my :null,
        profile_picture_id:null,
        flag:true
      }
    },
    methods:{
      Accepting:function(){
        this.flag = false
        let Information
        let that = this
        this.profile_picture = this.profile_picture_id
        let uid = firebase.auth().currentUser.uid
        firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',function(snapshot){
          Information  = snapshot.val()
          Information.profile_picture.value = that.profile_picture_id
          firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/profile_picture').set({
            value : Information.profile_picture.value
          })
        })
      }
    },
    created(){
      let that = this
      firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',function(snapshot){
          that.username = snapshot.val().username
          that.profile_picture = snapshot.val().profile_picture
      })
    }
  }
</script>
<style scoped>
#content{
  position: absolute;
  top:80%;
  left:5%;
  width: 100%;
}
.redSpan{
  color:red;
}
#avatarInDialog{
  position:reletive;
  left:15%;
}
</style>
