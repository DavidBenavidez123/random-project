import React, { useState, useEffect, useRef, } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import './Chat.css';
import socketIOClient from "socket.io-client";
import { Input, Loader, Icon } from 'semantic-ui-react'
import axios from 'axios'
import ScrollToBottom from 'react-scroll-to-bottom';
import ChatMessages from './ChatMessages'
import Picker from 'emoji-picker-react';
import Rooms from './Rooms'
import Users from './Users'
import { Drawer } from 'antd';

function Chat(props) {
    let data = 0
    let location = useParams();
    const [visible, setVisible] = useState(false)
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [editInput, setEditInput] = useState(false)
    const socketRef = useRef();
    const [showEmoji, setShowEmoji] = useState(false);
    const [roomUsers, setRoomUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [name, setName] = useState('');
    const [currentUsers, setCurrentUsers] = useState([]);

    let history = useHistory();
    useEffect(() => {
        socketRef.current = socketIOClient('http://localhost:5000')
        initialUsersLoad()
        firstLoad()
        joinRoom()
        joinRoomOn()
        loadMessages()
        loadupdateMessages()
        loadDeleteMessages()
        loadRooms()
        loadEmittedRoom()
        currentUsersSocket()
        currentUsersSocketOn()
        leavingUsersSocket()
        return () => {
            leavingUsersSocketOn()
            leavingUsersSocket()
            leavingRoom()
            leavingRoomOn()
            socketRef.current.disconnect();
        }
    }, [location.room])

    useEffect(() => {
        let scroll = document.querySelector('.css-y1c0xs')
        scroll.addEventListener('scroll', () => {
            let x = scroll.scrollTop
            if (x === 0) {
                setTimeout(() => {
                    loadScroll(data += 10)
                }, 500);
            }
        })
        return () => {
            scroll.removeEventListener('scroll', loadScroll);
        }

    }, [])

    const drawer = () => {
        setVisible(!visible)
    }

    const onEmojiClick = (event, emojiObject) => {
        setMessage(message => message + emojiObject.emoji);
    }

    const initialUsersLoad = () => {
        axios.get(`http://localhost:5000/api/rooms/room/${location.room}`)
            .then(res => {
                setCurrentUsers(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const currentUsersSocket = () => {
        const userId = props.user.user_id
        const userName = props.user.userName
        const room = location.room
        const data = { room, userId, userName }
        socketRef.current.emit("users room", data)
    }

    const currentUsersSocketOn = () => {
        socketRef.current.on("users room", (user) => {
            setCurrentUsers(user)
        })
    }

    const joinRoom = () => {
        let name = props.user.userName
        let room = location.room
        socketRef.current.emit("joining room", { name, room })
    }

    const joinRoomOn = () => {
        socketRef.current.on("joining room", (users) => {
            setRoomUsers(users)
        })
    }

    const leavingRoomOn = () => {
        socketRef.current.on("leaving room", (users) => {
            setRoomUsers(users)
        })
    }

    const leavingRoom = () => {
        let room = location.room
        socketRef.current.emit("leaving room", { room })
    }


    const sendMessages = () => {
        const users_id = props.user.user_id
        const username = props.user.userName
        const room_id = location.room
        const data = { message, users_id, username, room_id }
        socketRef.current.emit("sending message", data)
        setMessage('')
    }

    const loadMessages = () => {
        socketRef.current.on("sending message", (message) => {
            setMessages(newMessage => [...newMessage, message])
        })
    }

    const firstLoad = () => {
        axios.get(`https://chat-backend-1.herokuapp.com/api/message/${location.room}/messages`)
            .then(res => {
                if (res.data.room) {
                    history.push('/Global')
                }
                else {
                    setMessages(res.data.messages)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const loadScroll = (data) => {
        setLoading(true)
        let scroll = document.querySelector('.css-y1c0xs')
        const room = location.room
        const offSet = { data, room }
        axios.post('https://chat-backend-1.herokuapp.com/api/message/scroll', offSet)
            .then(res => {
                setLoading(false)
                scroll.scrollTop = 1
                setMessages(messages => [...res.data.messages, ...messages])
            })
            .catch(err => {
                console.log(err)
            })
    }

    const addRoom = () => {
        socketRef.current.emit("adding room", name)
        setName('')
    }



    const leavingUsersSocketOn = () => {
        const userId = props.user.user_id
        const userName = props.user.userName
        const room = location.room
        const data = { room, userId, userName }
        socketRef.current.emit("users leaving room", data)
    }

    const leavingUsersSocket = () => {
        socketRef.current.on("users leaving room", (user) => {
            console.log(user)
            setCurrentUsers(user)
        })
    }

    const loadEmittedRoom = () => {
        socketRef.current.on("adding room", (name) => {
            setRooms(room => [...room, name])
        })
    }

    const loadRooms = () => {
        axios.get(`https://chat-backend-1.herokuapp.com/api/rooms/rooms`)
            .then(res => {
                setRooms(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const updateMessages = (id, text, created_at) => {
        const message = { id, text, created_at }
        socketRef.current.emit("updating message", message)
    }

    const loadupdateMessages = () => {
        socketRef.current.on("updating message", (message) => {
            const id = message.id
            const text = message.text
            setMessages(newMessage => {
                const messageArray = [...newMessage]
                messageArray.forEach(message => {
                    if (message.messages_id === id) {
                        message.message = text
                    }
                })
                return messageArray
            })
        })
    }

    const deleteMessages = (id) => {
        socketRef.current.emit("deleting message", id)
    }

    const loadDeleteMessages = () => {
        socketRef.current.on("deleting message", (message) => {
            const id = message
            setMessages(newMessage => newMessage.filter(message => message.messages_id !== id))
        })
    }


    const editMessagetoggle = () => {
        setEditInput(!editInput)
    }

    return (
        <div className='chat-container'>
            <div className='Sidebar-desktop'>
                <div className='add-room'>
                    <h2>
                        Add a room!
                    </h2>
                    <Input
                        onChange={(event) => { setName(event.target.value) }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && (name.replace(/\s/g, "") !== "") && !event.shiftKey) {
                                addRoom()
                                event.preventDefault();
                            }
                        }}
                    />
                </div>
                <div className='rooms'>
                    {rooms.map((room) => {
                        return <Rooms
                            key={room.room_id}
                            room={room}
                            users={roomUsers}
                        />;
                    })}
                </div>
                <div className='users'>
                    <h2>
                        Users in room
                    </h2>
                    {currentUsers.map((user) => {
                        return <Users
                            user={user}
                        />;
                    })}

                </div>
            </div>

            <Drawer
                placement='left'
                closable={false}
                visible={visible}
                onClose={drawer}
            >
                <div className="Sidebar-mobile">
                    <div className='add-room'>
                        <h2>
                            Add a room!
                    </h2>
                        <Input
                            onChange={(event) => { setName(event.target.value) }}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" && (name.replace(/\s/g, "") !== "") && !event.shiftKey) {
                                    addRoom()
                                    event.preventDefault();
                                }
                            }}
                        />
                    </div>
                    <div className='rooms'>
                        {rooms.map((room) => {
                            return <Rooms
                                key={room.room_id}
                                room={room}
                                users={roomUsers}
                            />;
                        })}
                    </div>
                    <div className='users'>
                        <h2>
                            Users in room
                    </h2>
                        {currentUsers.map((user) => {
                            return <Users
                                user={user}
                            />;
                        })}
                    </div>
                </div>
            </Drawer>

            <div className="Chat">
                <div className="messages-scroll">
                    <div className='room-name'>
                        <div onClick={drawer} className='hamburger'>
                            <div className='line'></div>
                            <div className='line'></div>
                            <div className='line'></div>
                        </div>
                        <p >
                            {location.room}
                        </p>
                    </div>

                    <ScrollToBottom className='chat-box'>
                        {loading &&
                            <Loader active inline='centered' />
                        }
                        {messages.map((message, index) => {
                            return <ChatMessages
                                editMessagetoggle={editMessagetoggle}
                                index={index}
                                deleteMessages={deleteMessages}
                                updateMessages={updateMessages}
                                key={message.messages_id}
                                id={message.messages_id}
                                message={message} sentByUser={message.users_id === props.user.user_id}
                                editInput={editInput}
                            />;
                        })}
                    </ScrollToBottom>
                </div>
                <div className="Messages-Text-Box">
                    <textarea
                        id="story"
                        placeholder='Say something...'
                        value={message}
                        name='description'
                        onChange={(event) => { setMessage(event.target.value) }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && (message.replace(/\s/g, "") !== "") && !event.shiftKey) {
                                sendMessages()
                                event.preventDefault();
                            }
                        }}
                    >
                    </textarea>
                    <Icon onClick={() => { setShowEmoji(!showEmoji) }} size='large' name='smile outline' />
                    {
                        showEmoji &&
                        <Picker onEmojiClick={onEmojiClick} />
                    }
                </div>
            </div>
        </div >
    );
}



export default Chat;
