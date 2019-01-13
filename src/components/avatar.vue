<template>
    <v-menu
            transition="slide-y-transition"
            bottom
    >
        <div class="td-avatar"  slot="activator">
            <v-avatar size="48px">
                <img :src="profile_picture.value">
            </v-avatar>
            <span class="td-avatar__name" >{{username}}</span>
        </div>

    </v-menu>

</template>
<script>

    import  firebase from 'firebase'
    export default {
     data(){
       return{
         profile_picture:null,
         username:null,
         users : [],
       }
     },
      created() {
        firebase.database().ref('users/'+  firebase.auth().currentUser.uid).on('value',(snapshot)=>{
          this.username = snapshot.val().username;
          this.profile_picture = snapshot.val().profile_picture
        })

      }
          }
</script>
<style scoped lang="less">
    .td-avatar {
        display: flex;
        align-items: center;

        &__name {
            margin-left: 8px;
        }
    }
</style>
