import React from 'react'
import "../style.scss";
import Avatar from '../images/addAvatar.png'
import { useState } from 'react';
import {auth, storage, db} from '../firebase'
import { createUserWithEmailAndPassword ,updateProfile} from "firebase/auth";
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, addDoc,collection,setDoc } from "firebase/firestore";
import {useNavigate,Link} from 'react-router-dom' 

const Register = () => {
    const [err,setErr]=useState(false);
    const navigate= useNavigate();

    const handleSubmit= async (e)=>{
      e.preventDefault();
      const displayName=  e.target[0].value;
      const email=  e.target[1].value;
      const password = e.target[2].value;
      const file = e.target[3].files[0];
    
      try {

        //logging in user
        const res = await createUserWithEmailAndPassword(auth, email, password)

        //uplading images
        const date = new Date().getTime();
        const storageRef = ref(storage, `${displayName + date}`);

        await uploadBytesResumable(storageRef, file).then(()=>{
          getDownloadURL(storageRef).then(async (downloadURL) => {
            try {
              
              await updateProfile(res.user,{
                displayName,
                photoURL:downloadURL
              }); 
              

              await addDoc(collection(db,"users"), {
                uid:res.user.uid,
                displayName,
                email,
                photoURL:downloadURL
              });
              
              await setDoc(doc(db,"userChats",res.user.uid), {})
              navigate("/")


            }catch (error) {
              setErr(true);
            }
          })
        }); 
      } catch (error) {
        // console.log(error);
        // navigate("/")
        setErr(true);
      }
    };

  return (
    <div className='formContainer'>
      <div className='formWrapper'>
      <span className='logo'>Chit Chat</span>
      <span className='title'>Register</span>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder='Name'/>
            <input type="email" placeholder='Email'/>
            <input type="password" placeholder='Password'/>
            <input style={{display:'none'}} type="file" id="file" />
            <label htmlFor="file" style={{cursor:'pointer'}}>
              <img src={Avatar} alt="" />
              <span>Add an avatar</span>
            </label>
            <button>Sign Up</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
        {err && <span>Something Went Wrong</span>}
      </div>
    </div>
  )
}

export default Register
