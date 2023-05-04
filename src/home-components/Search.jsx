import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { collection, getDoc, query, setDoc, where, updateDoc, serverTimestamp, doc, getDocs } from "firebase/firestore";
import { db } from '../firebase';

const Search = () => {

  const [userName,setUserName] = useState("");
  const [user,setUser] = useState("");
  const [err,setErr] = useState(false);

  const {currentUser} = useContext(AuthContext);
 
  const handleSearch =async ()=>{
    //creating a query
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("displayName", "==", userName));

    // retrieving the results
    try {      
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data())
      });

      if(!user)
        setUser("no user")
      
    } catch (error) {
      setErr(true)
    }
  }

  const handleKeyDown =(e)=>{
    // console.log(e);
    e.code==="Enter" && handleSearch()    // e.code stores the key pressed at an instance. To understand better console.log(e)
  }



  const handleSelect = async ()=>{

    const combinedID = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid

    //check if the chats between the two users exists or not. If not then create one document 
    try {      

      const res= await getDoc(doc(db,"chats",combinedID));

      if(!res.exists())   //.exists() is a firebase function
        await setDoc(doc(db,"chats",combinedID),{messages:[]});

    
      // create user chats for both the users in the firestore database
      await updateDoc(doc(db,"userChats",currentUser.uid), {
        [combinedID +".userInfo"]:{
          uid:user.uid,
          displayName:user.displayName,
          photoURL:user.photoURL
        },
        [combinedID + ".date"]:serverTimestamp()
      })

      await updateDoc(doc(db,"userChats",user.uid), {
        [combinedID +".userInfo"]:{
          uid:currentUser.uid,
          displayName:currentUser.displayName,
          photoURL:currentUser.photoURL
        },
        [combinedID + ".date"]:serverTimestamp()
      })

    } catch (error) {
      setErr(true)
    }
    setUser(null)
    setUserName("")
  }



  return (
    <div className='search'>
      <div className="searchForm">
        <input type="text" placeholder='Find a user' onChange={e=> setUserName(e.target.value)} onKeyDown={handleKeyDown} value={userName}/>
      </div>
      {err && <span>No User Found...</span> }
      {
        user &&
          (<div className="userChat" onClick={handleSelect}>
            <img src={user.photoURL} alt="" /> 
            <div className="userChatInfo">
              <span>{user.displayName}</span>
            </div> 
          </div>)
      }
      
    </div>
  )
}

export default Search
