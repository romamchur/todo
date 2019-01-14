import firebase from "firebase";

const config = {
  apiKey: "AIzaSyABucStjYENfSoFConpZILuYbrfmxBIxr8",
  authDomain: "todo-1694d.firebaseapp.com",
  databaseURL: "https://todo-1694d.firebaseio.com",
  projectId: "todo-1694d",
  storageBucket: "todo-1694d.appspot.com",
  messagingSenderId: "730013255792"
};

const initFirebase = store => {
  firebase
    .initializeApp(config)
    .firestore()
    .settings({ timestampsInSnapshots: true });

  const auth = firebase.auth();
  const db = firebase.database();

  auth.onAuthStateChanged(() => {
    db.ref(`users/${auth.currentUser.uid}`).once("value", snapshot =>
      store.commit("updateState", snapshot.val())
    );
  });
};

export { initFirebase };
