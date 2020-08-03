import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyAHdixgnriGBs35DS0AazFrvT1CRgGu6BA",
  authDomain: "books-c89a5.firebaseapp.com",
  databaseURL: "https://books-c89a5.firebaseio.com",
  projectId: "books-c89a5",
  storageBucket: "books-c89a5.appspot.com",
  messagingSenderId: "52068632453",
  appId: "1:52068632453:web:98df267a744ec41df6a6ec"
}

class FirebaseSvc {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    } else {
      console.log("firebase apps already running...")
    }
  }


  parse = snapshot => {
    const { createdAt, text, user } = snapshot.val();
    const { key: _id } = snapshot;

    const message = {
      _id,
      createdAt,
      text,
      user,
    };
    return message;
  };


  refOn = (num, chatId, callback) => {
    firebase.database().ref(chatId)
      .limitToLast(num)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  send = (messages, chatId) => {

    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        createdAt: this.timestamp
      }

      firebase.database().ref(chatId).push(message);
    }
  };
}

const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;
