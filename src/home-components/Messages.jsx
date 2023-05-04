import React, { useContext, useEffect, useState } from 'react'
import Message from './Message'
import { ChatContext } from '../context/ChatContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

const Messages = () => {

  const [messages,setMessages] = useState([])

  const {data} = useContext(ChatContext)

  useEffect(()=>{
    if (!data || !data.chatID) return;
    const unsub = onSnapshot(doc(db, "chats", data.chatID), (doc) => {
      setMessages(doc.data().messages)
    })

    return ()=>{
      unsub()
    }

  },[data])

  // console.log(messages);
  return (
    <div className='messages'>
      {messages.map((m)=>(
        <Message message={m} key={m.id}/>
      ))}
    </div>
  )
}

export default Messages
