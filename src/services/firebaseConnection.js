import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'; 
import 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyBETJnkBwvGEMWNupXKA9rISG8-NdkUPxw",
  authDomain: "sistema-b03ef.firebaseapp.com",
  projectId: "sistema-b03ef",
  storageBucket: "sistema-b03ef.appspot.com",
  messagingSenderId: "80755123525",
  appId: "1:80755123525:web:5a24e392706c8e75c50a2c",
  measurementId: "G-LWNSCHNG6Z"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default firebase;