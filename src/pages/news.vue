<template>
    <div>
        <ul>
           <li v-for="news in news">
                {{news}}
           </li>
        </ul>
    </div>
</template>
<script>
import firebase from 'firebase'
 export default {
   data() {
     return {
        news:[],
     }
   },
   created(){
     var that = this;
     firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/news').once('value',function(snapshot){
       that.news = snapshot.val();
     })
   }
 }
  </script>