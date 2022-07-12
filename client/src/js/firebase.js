import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAYTjIAuSj6NaUfwiuUEmM8lSeu7JNFImM",
    authDomain: "nontes-c7e29.firebaseapp.com",
    projectId: "nontes-c7e29",
    storageBucket: "nontes-c7e29.appspot.com",
    messagingSenderId: "601925019554",
    appId: "1:601925019554:web:c1e76a779a74d94db074fb"
});

export const firestore = firebase.firestore();

export default firebase;
