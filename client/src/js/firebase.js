import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js';
import { getFirestore, collection, query, where, getDocs, enableIndexedDbPersistence } from 'https://www.gstatic.com/firebasejs/9.9.0/firebase-firestore.js';

const app = initializeApp({
    apiKey: "AIzaSyAYTjIAuSj6NaUfwiuUEmM8lSeu7JNFImM",
    authDomain: "nontes-c7e29.firebaseapp.com",
    projectId: "nontes-c7e29",
    storageBucket: "nontes-c7e29.appspot.com",
    messagingSenderId: "601925019554",
    appId: "1:601925019554:web:c1e76a779a74d94db074fb"
});

const db = getFirestore(app)

// enableIndexedDbPersistence(db);

const notesRef = collection(db, 'notes');

export async function getNoteDoc(noteName) {
    const q = query(notesRef, where('name', '==', noteName)); 
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return docs[0];
}
