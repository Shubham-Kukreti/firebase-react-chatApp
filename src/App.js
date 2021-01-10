/* eslint-disable jsx-a11y/alt-text */
import {useState,useRef} from 'react'
import './App.css';

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth'

import { useCollectionData } from 'react-firebase-hooks/firestore'


firebase.initializeApp({
  apiKey: "AIzaSyBWsPgSEpxehrFny2JaxAKA93ExS1nQVRc",
  authDomain: "superchat-440f9.firebaseapp.com",
  projectId: "superchat-440f9",
  storageBucket: "superchat-440f9.appspot.com",
  messagingSenderId: "974607969055",
  appId: "1:974607969055:web:f280dcaa3d1b821406de2a"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function SignIn() {

  const signInWithGoogle = () =>{
   const provider = new firebase.auth.GoogleAuthProvider();
   auth.signInWithPopup(provider);
    
  }

  return(
    <button onClick ={signInWithGoogle}>Sign in with Google</button>
  )
}



function ChatRoom() {


  const dummy = useRef()
  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)

  const [messages] = useCollectionData(query,{idField: 'id'})

  const [formValue, setFormValue] = useState('')
  
  const sendMessage = async(e) => {
   
    e.preventDefault()

    const {uid,photoURL} = auth.currentUser

    await messagesRef.add({
      text:formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({behaviour:'smooth'})
  }
  
  return(
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        <div ref={dummy}></div>
      
      </main>

      <form onSubmit={sendMessage}>
        <input type="text" value={formValue} onChange={(e) => setFormValue(e.target.value)}/>

        <button type="submit">submit</button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const {text, uid, photoURL} = props.message

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'
  return(
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>


  )
}

function App() {
  
  const [user] = useAuthState(auth);
  
  return (
    <div className="App">
      <header className="App-header">
        {auth.currentUser && <button onClick={()=>auth.signOut()}>Sign Out</button>} 
      </header>
      <section>
        {user? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}





export default App;
