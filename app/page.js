'use client'
import Image from 'next/image';
import io from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';
import tw from 'tailwind-styled-components';
//ICONS
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SourceIcon from '@mui/icons-material/Source';
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
//FRIENDS API
import { friends } from './friends';



export default function Home() {

  
  //Connecting my server to my client sider
  const ENDPOINT = 'http://www.localhost:8080';

  const socket = io(ENDPOINT, {
    transports: ['websocket'],
  });

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  //
  const inputRef = useRef('');
  const onConnected = () => {
    setIsConnected(true);
  };
  //
  const onDisconnected = () => {
    setIsConnected(false);
  };
  useEffect(() => {
    //Ensure it's connected
    // const connection = socket.on('connect',()=> {
    //     return "Connected"
    // })
    if (socket.connected) {
      onConnected();
    } else {
      onDisconnected();
    }
    // socket.on('connect', onConnected())
    // socket.on('disconnected', onDisconnected())
    //
    // socket.off("connect", onConnected());
    // socket.off("disconnect", onDisconnected());

    // Listen for incoming messages
    socket.on('chat message', (message) => {
      // setMessages((prevMessages) => [...prevMessages, message]);
      const newMsg = messages.concat(message);
      setMessages(newMsg);
      //   setMessages((prevMsg) => [message])
    });
    //Handle Error
    socket.on('connect_error', (err) => {
      console.log(`Sockect Connection Error: ${err.message}`);
    });
  }, [socket, messages]);

  const sendMessage = () => {
    //Remove blank space in the text
    let text;
    text = inputRef.current?.value;
    let msg = text.trim();
    // setNewMessage(msg)
    if (msg) {
      socket.emit('chat message', msg);
      msg = '';
      text = '';
      setNewMessage('');
    }
  };
  console.log('Chat: ', messages);

  return (
    <main className="flex w-full h-screen">
      <section className="w-24 h-full bg-gray-200 flex flex-col border-r border-gray-300">
        <div className="w-full h-14 grid place-items-center border-b border-gray-300 text-blue-700 font-sembold">
          Chatme
        </div>
        <div className="w-full h-full grid content-between  justify-center py-6">
         <img src='/user/me.jpg' alt='Me' className='rounded-lg w-10 h-10 object-contain' />
         <span className='text-slate-800 text-base font-medium'>Sign Out</span>
        </div>
      </section>
      <section className="w-56 h-full bg-gray-200 flex flex-col border-r border-gray-200">
        <SearchContainer >
          <div className="w-36 h-9 bg-white flex  rounded-lg px-2">
            {/* <div className="w-4 h-auto rounded-lg bg-white flex items-center justify-center">
              <SearchIcon fontSize="small" />
            </div> */}

            <input
              type="text"
              className="w-full h-9 border-none focus:outline-none rounded-lg placeholder:text-xs"
              placeholder="Search"
            />
          </div>
          <div className="w-9 h-9 rounded-lg bg-white grid place-items-center">
            <AddIcon fontSize="medium" />
          </div>
        </SearchContainer>
        <div className='w-full h-full flex flex-col'>
          {friends?.map(({ name, srcImage, chat, age, id}) => (<FriendContainer key={id} >
            <div className='w-12 h-12 grid place-items-center'>
            <img src={srcImage} alt='Me' className='rounded-lg w-10 h-10 object-contain' />
            </div>
            <span className='w-full h-full grid flex-col px-2 gap-x-2  content-around'>
                <h3 className='text-lg font-medium'>{name}</h3>
                <p className='text-xs w-full'>{chat[0]}</p>
            </span> 
          </FriendContainer>
          ))}
        </div>
      </section>
      <section className="flex-auto flex flex-col">
        <VisibleNameContainer >
          <h1 className='text-3xl font-semibold'>John C.</h1>
          <MoreHorizIcon fontSize="large" className='text-yellow-500'/>
        </VisibleNameContainer>
        <div className="flex-auto flex-col bg-white">
        {messages.map((message, index) => (
          <div className='w-auto flex gap-x-2 items-center' key={index}>
            <img src='/users/userOne.png' className='w-10 h-10 rounded-full border-2 border-green-300' alt='costumer One' />
            <p>{message}</p>
          </div>
        ))}</div>
        <div className="w-full h-28 bg-white border-t border-gray-200 px-4 ">
          <div className="w-full h-10 flex items-center justify-between">
            <div className="w-14 h-auto flex justify-between">
              <InsertEmoticonIcon fontSize="medium" />
              <SourceIcon fontSize="medium" />
            </div>
            <div className="w-14 h-auto flex justify-between">
              <CallIcon fontSize="medium" />
              <VideocamIcon fontSize="medium" />
            </div>
          </div>
          <div className='w-full flex '>
          <input
            type="text"
            ref={inputRef}
            className="w-full h-14 border-none focus:outline-none"
          />
          <button onClick={sendMessage} type='button' className='w-14 h-full bg-blue-600 text-white focus:outline-none cursor-pointer'>Send</button>

          </div>
        
        </div>
      </section>
    </main>
  );
}


const SearchContainer = tw.div`w-full h-14 bg-gray-100 flex items-center justify-between  px-2 border-b border-gray-300`
const VisibleNameContainer = tw.div`w-full h-14 bg-gray-100 border-b border-gray-300 flex justify-between items-center px-6`

const FriendContainer = tw.div`w-full h-14 px-2 flex border-b border-gray-300`