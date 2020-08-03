import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAHdixgnriGBs35DS0AazFrvT1CRgGu6BA",
    authDomain: "books-c89a5.firebaseapp.com",
    databaseURL: "https://books-c89a5.firebaseio.com",
    projectId: "books-c89a5",
    storageBucket: "books-c89a5.appspot.com",
    messagingSenderId: "52068632453",
    appId: "1:52068632453:web:98df267a744ec41df6a6ec"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };


 
