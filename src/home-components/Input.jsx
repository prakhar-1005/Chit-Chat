import React, { useContext, useState } from 'react'
import Img from '../images/img.png'
import Attach from '../images/attach.png'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { db, storage } from '../firebase'
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'


const Input = () => {

  const [text,setText] = useState("")
  const [img,setImg]= useState(null)
  const [err,setErr]= useState(false)


  const {currentUser} = useContext(AuthContext)
  const {data} = useContext(ChatContext)

  const handleSend = async ()=>{
    
    //check if it is an image or text
    if(img){
      const storageRef = ref(storage, uuidv4());

      uploadBytesResumable(storageRef, img).then(()=>{
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await updateDoc(doc(db, "chats", data.chatID), {
              messages: arrayUnion({
                id:uuidv4(),
                text,
                senderID:currentUser.uid,
                date:Timestamp.now(),
                img:downloadURL,
              }),
            });

          }catch (error) {
            setErr(true)
          }
        })
      }); 


    }else{
      await updateDoc(doc(db, "chats", data.chatID), {
        messages: arrayUnion({
          id:uuidv4(),
          text,
          senderID:currentUser.uid,
          date:Timestamp.now()
        })
    });
    }

    await updateDoc(doc(db,"userChats",currentUser.uid),{
      [data.chatID+".lastMessage"]:{text},    // this is how to update nested objects. It's updating the lastMessage property of an object nested inside another object 'data' using the value of data.chatID as the key. The {text} value is the new value to be assigned to the lastMessage property.
      [data.chatID+".date"]:serverTimestamp()
    })
    

    await updateDoc(doc(db,"userChats",data.user.uid),{
      [data.chatID+".lastMessage"]:{text},    
      [data.chatID+".date"]:serverTimestamp()
    })

    setText("")
    setImg(null)
  }


  const handleKeyDown =(e)=>{
    e.code=="Enter" && handleSend();
  }


  return (
    <div className='input'>
    {err && <span style={{color:'white'}}>Somthing Went Wrong</span> }
      <input type="text" placeholder='Type something.....' onChange={e=>setText(e.target.value)} value={text} onKeyDown={handleKeyDown} />
      <div className="send">
        <img src={Attach} alt="" />
        <input type="file" style={{display:"none"}} id="file" onChange={e=>setImg(e.target.files[0])}  />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>

    </div>
  )
}

export default Input