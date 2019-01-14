<template>
    <v-content>
        <v-container fluid fill-height>
            <v-layout column>
                <v-flex class="login__question">
                    <span>Already have an account?</span>
                    <v-btn color="info" dark :to="'/login'"> Sign In </v-btn>
                </v-flex>
                <v-flex class="login__form-wrapper">
                    <v-form ref="form" class="login__form">
                        <span class="login__form-title">ToDo</span>
                        <v-text-field
                                v-model="nickname"
                                label="Nickname"
                                solo
                                dark
                                type="text"
                                :rules="[rules.required, rules.minNickname]"
                        >
                        </v-text-field>
                        <v-text-field
                                v-model="email"
                                label="Email"
                                solo
                                dark
                                :rules="[rules.required, rules.email]"
                        ></v-text-field>
                        <v-text-field
                                v-model="password"
                                label="Password"
                                solo
                                dark
                                type="password"
                                :rules="[rules.required, rules.min]"
                        >
                        </v-text-field>

                        <v-btn color="info" dark @click="signup()"> Sign Up </v-btn>
                    </v-form>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>
<script>
  import firebase from 'firebase'
  export default {
    data() {
      return {
        arrayOfUids : [],
        uid:null,
        info:null,
        nickname : null,
        email: null,
        password: null,
        users :[],
        rules: {
          required: value => !!value || "Required.",
          min: v => v && v.length >= 8 || "Min 8 characters.",
          email: v => this.validateEmail(v) || "Please enter valid email.",
          minNickname: v => v && v.length >= 4 || "Min 4 characters.",
        }
      };
    },
    methods: {
      validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      },
      signup() {
        if(this.$refs.form.validate()) {
          localStorage.token = "generatedToken"
          firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
            (user)=>{
              var userId= firebase.auth().currentUser.uid
              firebase.database().ref('users/' + userId).set({
                news:['Signed Up!'],
                uid:firebase.auth().currentUser.uid,
                username:this.nickname,
                email: this.email,
                profile_picture : {value:'https://lh3.googleusercontent.com/l6JAkhvfxbP61_FWN92j4ulDMXJNH3HT1DR6xrE7MtwW-2AxpZl_WLnBzTpWhCuYkbHihgBQ=w640-h400-e365'}
              });
              var  individual_info =[
              {
                chat:[{author:'Admin',
                        text:"Hi,it's your INDIVIDUAL chat :)",
                        avatar:"https://wi-images.condecdn.net/image/6DoWNVJlrWM/crop/2040/f/black-hole.jpg"}],
                countCompleted:0,
                countFailed:0,
                name: 'Individual',
                  teammates:
                  [{
                    uid:firebase.auth().currentUser.uid,
                    username : this.nickname,
                    profile_picture:'https://lh3.googleusercontent.com/l6JAkhvfxbP61_FWN92j4ulDMXJNH3HT1DR6xrE7MtwW-2AxpZl_WLnBzTpWhCuYkbHihgBQ=w640-h400-e365'
              }],
                  creator
              : {
                    uid:firebase.auth().currentUser.uid,
                    name:this.nickname
              },
                  tasks
              :
                [{
                  team:{value:'Individual'},
                  date: new Date(),
                  name : 'Sign Up',
                  completed:{value:true},
                  failed:{value:false},
                  main:{main:false}
                }],
                  avatar
              :
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbU62a0ZbEa7UgZ054vrXmUbRwd77RRQPouSVP-qlM6g96GhOE'
              },
            ]
              firebase.database().ref('users/' + userId+'/teams').set({
                team : individual_info
              });

              this.$router.replace('/')

            }),



            (err) =>{
              alert(err.message);
            }

        }
      },
      signupFacebook(){
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {

var token = result.credential.accessToken;

var user = result.user;
console.log(user)
firebase().database().ref('users').once('value',function(snapshot){
  
})
var userId= firebase.auth().currentUser.uid
firebase.database().ref('users/' + userId).set({
  news:['Signed Up!'],
  uid:firebase.auth().currentUser.uid,
  username:user.displayName,
  email: user.email,
  profile_picture:{value:user.photoURL},
  teams:{team:[{  chat:[{author:'Admin',
            text:"Hi,it's your INDIVIDUAL chat :)",
            avatar:"https://wi-images.condecdn.net/image/6DoWNVJlrWM/crop/2040/f/black-hole.jpg"}],
    countCompleted:0,
    countFailed:0,
    name: {value:'Individual'},
      teammates:
      [{
        uid:firebase.auth().currentUser.uid,
        username : user.displayName,
        profile_picture:'https://lh3.googleusercontent.com/l6JAkhvfxbP61_FWN92j4ulDMXJNH3HT1DR6xrE7MtwW-2AxpZl_WLnBzTpWhCuYkbHihgBQ=w640-h400-e365'
  }],
      creator
  : {
        uid:firebase.auth().currentUser.uid,
        name:user.displayName
  },
      tasks
  :
    [{
      team:{value:'Individual'},
      date: new Date(),
      name : 'Sign Up',
      completed:{value:true},
      failed:{value:false},
      main:{main:false}
    }],
      avatar
  :
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbU62a0ZbEa7UgZ054vrXmUbRwd77RRQPouSVP-qlM6g96GhOE'},]
  }
});


this.$router.replace('/')



}).catch(function(error) {
// Handle Errors here.
var errorCode = error.code;
console.log(errorCode)
var errorMessage = error.message;
// The email of the user's account used.
var email = error.email;
// The firebase.auth.AuthCredential type that was used.
var credential = error.credential;
// ...
});
      }
    },
    mounted (){

    if(firebase.auth().currentUser){
      this.$router.replace('/')
    }
    }
  };
</script>
<style scoped lang="less">
    .login {
        &__question {
            height: 60px;
            flex: none;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
        &__form {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            &-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            &-title {
                font-size: 48px;
                margin-bottom: 16px;
            }

            .v-input {
                flex: none;
                width: 416px;
            }
        }
    }
</style>
