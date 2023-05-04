import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { createContext } from 'react'
import { auth } from '../firebase';


//context created
export const AuthContext = createContext();

const AuthContextProvider = ({children}) => {

    // this is the user that is being created and it will be able to reach any component via AuthContextProvider
    const [currentUser,setCurrentUser] = useState({});  

    useEffect(()=>{
        //check if the user is already logged in 
        //firebase takes care of whether the user is logged in or not. We don't need to store the user in localStorage or cookies 
        const unsub = onAuthStateChanged(auth,(user)=>{
            setCurrentUser(user)
            console.log(user);
        })
        return ()=>{ //since onAuthStateChanged is a realtime function so it is important to use a cleanup function to avoid memory leak
            unsub()
        }
    },[])

  return (
    <AuthContext.Provider value={{currentUser}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
